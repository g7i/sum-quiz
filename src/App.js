import './App.css';
import {useRef, useState} from "react";

const nums = Array.from({length: 18}).map((_, i) => {
    return i > 8 ? i - 8 : i - 9
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const STATUS = {
    idle: 0,
    playing: 1,
    answer: 2,
    result: 3,
}
Object.freeze(STATUS)

function App() {
    const [text, setText] = useState(null);
    const [result, setResult] = useState(null);
    const counter = useRef(0);
    const inpRef = useRef();
    const progRef = useRef();
    const [status, setStatus] = useState(STATUS.idle);

    const round = async () => {
        const num = nums[getRandomInt(nums.length - 1)]
        setText(num)
        counter.current += num
        await delay(1500)
    }

    const start = async () => {
        setStatus(STATUS.playing);
        for (let i = 0; i < 10; i++) {
            await round();
            progRef.current.value = i + 1
        }
        setStatus(STATUS.answer)
        await delay(100)
        inpRef.current.focus()
        inpRef.current.value = null;
        await delay(4000)
        const r = counter.current == inpRef.current.value ? "Cleared" : "Failed"
        inpRef.current.value = null;
        setResult(r)
        setStatus(STATUS.result)
        await delay(4000)
        setStatus(STATUS.idle)
    }

    const getContent = () => {
        switch (status) {
            case STATUS.playing:
                return (
                    <div className='flex items-center justify-center flex-col'>
                        <div className="counter text-white">{text}</div>
                        <progress value={0} ref={progRef} max={10}/>
                    </div>
                );
            case STATUS.answer:
                return (
                    <div className="text-center lg:flex">
                        <div className="text-2xl md:text-4xl xl:text-6xl mb-6 lg:mb-0 lg:mr-2">Enter Answer</div>
                        <input type="number" className="text-center bg-transparent text-2xl md:text-4xl xl:text-6xl"
                               ref={inpRef} defaultValue={null}/>
                    </div>
                );
            case STATUS.result:
                return (
                    <div className="text-4xl md:text-6xl lg:text-8xl text-white">Result : {result}</div>
                );
            default:
                return (
                    <div className="flex flex-col items-center text-white">
                        <div className="text-4xl mb-9 font-bold">Ready to begin?</div>
                        <button
                            className="px-14 py-4 hover:text-black text-2xl border-2 w-min border-white rounded hover:bg-white cursor-pointer transition-all"
                            onClick={start}>Start
                        </button>
                    </div>
                );
        }
    }

    return (
        <div className="bg-red-600 h-screen flex justify-center items-center">
            {getContent()}
        </div>
    );
}

export default App;
