// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  assessments: string[]
}

type QuestionDomainMap = {
    [key: string]: string
}

type DomainAssessmentMap = {
    [key: string]: {
        threshold: number,
        assessment: string
    }
}

export type ScreenerAnswer = {
    value: number,
    question_id: string,
}

//TODO: store this in a postgres table?
const question_domain_map: QuestionDomainMap = {
    question_a: "depression",
    question_b: "depression",
    question_c: "mania",
    question_d: "mania",
    question_e: "anxiety",
    question_f: "anxiety",
    question_g: "anxiety",
    question_h: "substance_use",
}

const domain_assessment_map: DomainAssessmentMap = {
    "depression": {
        threshold: 2,
        assessment: "PHQ-9",
    },
    "mania": {
        threshold: 2,
        assessment: "ASRM",
    },
    "anxiety": {
        threshold: 2,
        assessment: "PHQ-9",
    },
    "substance_use": {
        threshold: 1,
        assessment: "ASSIST",
    },
}

export function screenerScorer( answers: ScreenerAnswer[] ): string[]{
    const domain_scores: { [key: string]: number } = {}
    const assessments = new Set<string>();
    
    for (const answer of answers) {
        const {question_id, value} = answer;
        const domain = question_domain_map[question_id];

        if (question_id in question_domain_map) {
            if (question_domain_map[question_id] in domain_scores) {
                domain_scores[domain] += value;
            } else {
                domain_scores[domain] = value;
            }
        }

        if (domain_scores[domain] >= domain_assessment_map[domain].threshold) {
            assessments.add(domain_assessment_map[domain].assessment)
        }
    }

    return Array.from(assessments);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const body = JSON.parse(req.body);
    const assessmentNames = screenerScorer(body)

    res.status(200).json({assessments: assessmentNames})
}
