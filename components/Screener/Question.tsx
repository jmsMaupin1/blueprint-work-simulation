import React, { useState } from 'react';
import AnswerOptions from './AnswerOptions';

import { Question, Answer } from '@/pages/api/screener/[id]';

type Props = {
    sectionTitle?: string,
    question: Question,
    answers: Answer[],
    onSubmit?: (questinon_id: string, selectedAnswer: Answer) => void,
}

const Question = ({
    sectionTitle,
    question, 
    answers, 
    onSubmit
}: Props) => {

    const submitAnswer = (opt: Answer) => {
        if (!onSubmit) return;

        onSubmit(
            question.question_id,
            opt
        )
    }

    return (
        <div className='w-full'>
            {
                sectionTitle &&
                <div className='flex justify-center w-full text-2xl'>
                    {sectionTitle}
                </div>
            }
            <div className='flex justify-center w-full text-xl mt-4'>
                {question.title}
            </div>
            <br/>
            <div className='flex justify-center'>
                <div className='w-80'>
                    <AnswerOptions 
                        options={answers}
                        onChange={submitAnswer}
                    />
                </div>
            </div>
            
        </div>
    )
}

export default Question