/**
 * Agent Orchestrator — Groq-powered conversational layer
 * Converts user intent into structured responses using session context.
 */
import { callLLM } from '../services/llm';
import { SYSTEM_PROMPT } from './prompts';

export class Orchestrator {
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  async chat(
    userMessage: string,
    contextData?: {
      skillGap?: any;
      studyPlan?: any;
      quizHistory?: any;
    }
  ): Promise<string> {
    try {
      // Build context summary for the LLM
      let contextBlock = '';
      if (contextData && contextData.skillGap) {
        const g = contextData.skillGap;
        contextBlock += `\n\n[CURRENT SESSION CONTEXT]
Role: ${g.targetRole || 'Not specified'}
Match Score: ${g.matchScore}%
Matched Skills: ${g.matched?.map((s: any) => s.name).join(', ') || 'none'}
Missing Skills: ${g.missing?.map((s: any) => s.name).join(', ') || 'none'}`;
      }
      if (contextData && contextData.studyPlan) {
        const p = contextData.studyPlan;
        contextBlock += `\nStudy Plan: ${p.totalDays} days targeting ${p.targetRole}`;
        if (p.schedule?.length > 0) {
          contextBlock += `\nDay 1: ${p.schedule[0].topic}`;
        }
      }
      if (contextData && contextData.quizHistory && contextData.quizHistory.length > 0) {
        const last = contextData.quizHistory[contextData.quizHistory.length - 1];
        contextBlock += `\nLast Quiz: ${last.topic} — ${last.score}% (${last.passed ? 'passed' : 'failed'})`;
      }

      const systemWithContext = SYSTEM_PROMPT + contextBlock;

      // Build conversation context (last 6 turns for brevity)
      const recentHistory = this.conversationHistory.slice(-6);
      const historyText = recentHistory
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const fullUserPrompt = historyText
        ? `Previous conversation:\n${historyText}\n\nUser: ${userMessage}`
        : userMessage;

      const reply = await callLLM(systemWithContext, fullUserPrompt);

      // Store in history
      this.conversationHistory.push({ role: 'user', content: userMessage });
      this.conversationHistory.push({ role: 'assistant', content: reply });

      return reply;
    } catch (err: any) {
      console.error('[Orchestrator] chat error:', err?.message || err);
      const rawKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '';
      if (!rawKey.trim()) {
        return "⚠️ GROQ_API_KEY is not detected. Please ensure your .env file contains a valid GROQ_API_KEY=gsk_... and restart the server.";
      }
      if (contextData?.skillGap) {
        const missing = contextData.skillGap.missing?.map((s: any) => s.name).join(', ') || 'none';
        return `I had a temporary issue calling the AI model (${err?.message || 'error'}), but for ${contextData.skillGap.targetRole || 'your role'}, your key skills to prepare are: ${missing}. Check your Study Plan tab!`;
      }
      return `I'm having trouble connecting to the AI model (${err?.message || 'please try again'}). Please verify your GROQ_API_KEY in .env and restart.`;
    }
  }

  async explainSkillGap(skillGap: any): Promise<string> {
    try {
      const missingNames = skillGap.missing?.map((s: any) => s.name).join(', ') || 'none';
      const matchedNames = skillGap.matched?.map((s: any) => s.name).join(', ') || 'none';
      return await callLLM(
        'You are CareerPilot AI, a supportive and expert career coach. Be encouraging, specific, and domain-aware. Keep responses to 2-3 sentences.',
        `Explain this skill gap analysis to the candidate in a friendly, encouraging way:
Role: ${skillGap.targetRole || 'the target role'}
Match Score: ${skillGap.matchScore}%
Strong skills: ${matchedNames}
Needs work: ${missingNames}
Recommendation: ${skillGap.recommendation}

Be specific — mention actual skill names. Don't mention AWS unless it's actually in the data.`
      );
    } catch {
      const missing = skillGap.missing?.length || 0;
      return `You have a ${skillGap.matchScore}% match for this role! You have strong foundations with ${skillGap.matchedCount} skills matched. Focus on closing the ${missing} gap${missing !== 1 ? 's' : ''}: ${skillGap.missing?.slice(0, 3).map((s: any) => s.name).join(', ')}.`;
    }
  }

  async explainPlan(plan: any): Promise<string> {
    try {
      const day1 = plan.schedule?.[0];
      return await callLLM(
        'You are CareerPilot AI. Explain study plans in a motivating, clear, and concise way. Keep to 2-3 sentences.',
        `Explain this study plan to the candidate:
Role: ${plan.targetRole}
Duration: ${plan.totalDays} days, ${plan.dailyMinutes} minutes/day
Day 1: ${day1?.topic} — ${day1?.objective}
Total topics to cover: ${plan.schedule?.length}

Summarize in 2-3 motivating sentences. Mention Day 1 specifically.`
      );
    } catch {
      const day1Topic = plan.schedule?.[0]?.topic || 'the first topic';
      return `Your ${plan.totalDays}-day plan is ready! Day 1 focuses on ${day1Topic}. Spend ${plan.dailyMinutes} minutes each day and you'll be well-prepared for ${plan.targetRole}.`;
    }
  }

  async explainQuizResult(result: any): Promise<string> {
    try {
      return await callLLM(
        'You are CareerPilot AI. Give specific, constructive, and encouraging feedback on quiz results. Keep to 2 sentences.',
        `Give feedback on this quiz result:
Topic: ${result.topic}
Score: ${result.score}%
Correct: ${result.correctCount} / ${result.totalQuestions}
Passed: ${result.passed}

Be encouraging. If passed, celebrate and suggest next steps. If failed, be constructive and specific.`
      );
    } catch {
      return result.passed
        ? `Great job scoring ${result.score}% on ${result.topic}! Keep the momentum going with the next topic.`
        : `You scored ${result.score}% on ${result.topic} — reviewing the core concepts will help you improve. Your plan has been updated to reinforce this area.`;
    }
  }
}
