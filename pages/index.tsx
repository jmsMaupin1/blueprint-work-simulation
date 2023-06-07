import React, { useCallback, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router';

import { Answer, Screener, Section } from '@/pages/api/screener/[id]'
import Question from '@/components/Screener/Question';
import ProgressBar from '@/components/Screener/ProgressBar';
import { ScreenerAnswer } from '@/pages/api/screener/score';
import LoadingSpinner from '@/components/General/LoadingSpinner';


function getScreener(setScreener: Function, setIsLoading: Function) {
    setIsLoading(true);
    fetch('/api/screener/abcd-123')
        .then(res => res.json())
        .then(json => {
            setScreener(json);
            setIsLoading(false);
        });
}

function scoreScreener(screenerAnswers: ScreenerAnswer[], setIsLoading: Function, router: NextRouter) {
    setIsLoading(true);
    fetch('/api/screener/score', {
        method: 'POST',
        body: JSON.stringify(screenerAnswers)
    })
    .then(res => res.json())
    .then(json => {
        router.push({
            pathname: '/screener/results',
            query: json,
        })
        setIsLoading(false);
    })
}

function ScreenerPage() {
    const router = useRouter();

    const [screener, setScreener] = useState<Screener>();
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [questionCount, setQuestionCount] = useState<number>(0);
    
    const [currentSection, setCurrentSection] = useState<Section>()
    const [sectionCount, setSectionCount] = useState<number>();
    const [sectionIndex, setSectionIndex] = useState<number>(0);

    const [screenerAnswers, setScreenerAnswers] = useState<ScreenerAnswer[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const nextSection = useCallback(() => {
        if (sectionCount && sectionIndex > sectionCount) {
            setQuestionIndex(0);
            setSectionIndex(sectionIndex + 1)
        } else {
            scoreScreener(screenerAnswers, setIsLoading, router);
        }
    }, [router, screenerAnswers, sectionCount, sectionIndex]);

    useEffect(() => {
        getScreener(setScreener, setIsLoading);
    }, []);

    useEffect(() => {
        if (screener) {
            setCurrentSection(screener.content.sections[sectionIndex])
            setSectionCount(screener.content.sections.length);
            setQuestionCount(screener.content.sections.reduce((sum, section) => {
                return sum + section.questions.length;
            }, 0))
        }
    }, [screener, sectionIndex])

    useEffect(() => {
        if (screenerAnswers.length > 0 && screenerAnswers.length >= questionCount) {
            nextSection();
        }
    }, [screenerAnswers, questionCount, nextSection])

    const onQuestionAnswer = (question_id: string, answer: Answer) => {
        setScreenerAnswers([
            ...screenerAnswers,
            {
                question_id,
                value: answer.value
            }
        ])
        if (currentSection && questionIndex + 1 < currentSection?.questions.length) {
            setQuestionIndex(prevValue => prevValue + 1)
        } 
    }

    if (!screener || !currentSection || isLoading) {
        return (
            <div className='h-screen flex flex-col'>
                <div className='w-full flex flex-1 justify-center items-center'>
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    return (
        <div className='h-screen flex flex-col'>
            <div className='flex justify-center py-1'>
                {screener.content.display_name}                    
            </div>
            <div className='w-full flex flex-1 justify-center items-center'>
                <div className='w-full'>
                    <Question
                        sectionTitle={currentSection?.title}
                        question={currentSection.questions[questionIndex]}
                        answers={currentSection.answers}
                        onSubmit={onQuestionAnswer}
                    />
                    <div className='flex justify-center'>
                        <div className='w-64 flex justify-center'>
                            question {questionIndex + 1} out of {questionCount}
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className='w-1/4'>
                            <ProgressBar 
                                currentQuestionCount={questionIndex}
                                maxQuestionCount={questionCount}
                            />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default ScreenerPage