import React, { useEffect } from 'react'

type Props = {
    currentQuestionCount: number,
    maxQuestionCount: number
}

const ProgressBar = ({
    currentQuestionCount,
    maxQuestionCount
}: Props) => {
  return (
    <div className='w-full bg-gray-200 rounded-full h-3 mt-3'>
        <div className='progress-bar h-3 rounded-full' style={{width: `${(currentQuestionCount / maxQuestionCount) * 100}%`}}/>
    </div>
  )
}

export default ProgressBar