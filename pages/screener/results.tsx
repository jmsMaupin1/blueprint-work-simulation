import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function Results() {
    const router = useRouter();
    const { assessments } = router.query

    const [recommendations, setRecommendations] = useState<string[]>([]);

    useEffect(() => {
        if (assessments) {
            if (Array.isArray(assessments)) {
                setRecommendations(assessments);
            } else {
                setRecommendations([assessments]);
            }
        }
    }, [assessments])
    return (
        <div className='h-screen flex flex-col'>
            <div className='w-full flex flex-1 justify-center items-center'>
                <div>
                    <span className='text-xl'>
                        Recommended Assessments:
                    </span>
                    {
                        recommendations.map((rec, index) => {
                            return (
                                <div 
                                    key={index} 
                                    className='text-center border p-4 mt-3 rounded-lg answer-buttons cursor-pointer'
                                    onClick={() => console.log('fetch assessment')}
                                >
                                    {rec}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Results