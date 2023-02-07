import React, {useState, useEffect} from 'react'
import {useParams, useSearchParams, useLocation} from 'react-router-dom'

export default function List() {
    const params = useParams()    
    const [searchParams, setSearchParams] = useSearchParams()    
    const location = useLocation()   
    const [testData, setTestData] = useState('1') 
    console.log(3)

    const hTest = () => {
        // setSearchParams('id=999')
        setSearchParams('id=999&number=0')
        const _id = searchParams.get('id')
        console.log(_id)
        setTestData('2')
        // setTimeout(() => {
        //     const _id = searchParams.get('id')
        //     const _number = searchParams.get('number')
        //     console.log(22)
        // }, 1000);
    }

    const hTest2 = () => {
        setTimeout(() => {
            const _id = searchParams.get('id')
            const _number = searchParams.get('number')
            console.log(22)
        }, 1000);
    }

    useEffect(() => {
        const _id = searchParams.get('id')
        const _number = searchParams.get('number')
        console.log(testData)
    }, [testData])

    return (
        <div>
            List..
            <button onClick={hTest}>222</button>
            <button onClick={hTest2}>222333</button>
        </div>
    )
}
