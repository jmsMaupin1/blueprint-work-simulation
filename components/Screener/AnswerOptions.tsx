import React, { ChangeEventHandler, useEffect, useState } from 'react'

export type Option = {
    title: string,
    value: number,
}

type Props = {
    options: Option[],
    onChange: Function,
}

const AnswerOptions = ({options, onChange}: Props) => {
    const [selectedOpt, setSelectedOpt] = useState<Option>();

    const onOptionChange = (opt: Option) => {
        setSelectedOpt(opt)
        onChange(opt)
    }

    return (
        <div className='w-full'>
            {
                options.map((opt, index) => {
                    return (
                        <div 
                            key={index}
                            className='flex items-center pl-4 pr-4 mt-2 mb-2 border rounded dark:border-gray-700 answer-buttons'
                            onClick={() => onOptionChange(opt)}
                        >
                            <input
                                className='w-1/12 h-4'
                                type='radio'
                                name='quizanswers'
                                value={opt.title}
                                id={opt.title}
                                checked={selectedOpt?.title === opt.title}
                                onChange={e => e.stopPropagation()}
                            />
                            <label 
                                htmlFor={opt.title}
                                className='py-4 ml-2 text-sm font-medium'
                                onClick={e => e.stopPropagation()}
                            >
                                {opt.title}
                            </label>
                        </div>
                    )
                })
            }
            
        </div>
    )
}

export default AnswerOptions