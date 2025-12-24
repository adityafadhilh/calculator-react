import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Calculator } from './components/Calculator';
import { Graph } from './components/Graph';
import { Speech } from './components/Speech';
import CalculatorIcon from './assets/CalculatorIcon';
import GraphIcon from './assets/GraphIcon';
import MicIcon from './assets/MicIcon';

function App() {
  const [isActiveTab, setIsActiveTab] = useState<'Calculator' | 'Graph' | 'Speech'>('Calculator');

  useEffect(() => {
    document.body.style.zoom = "80%";

    return () => {
      document.body.style.zoom = "100%";
    };
  }, []);

  return (
    <>
      <div className='w-full mt-32 flex flex-col justify-center items-center'>
        <h1 className='text-5xl font-bold'>Calculator</h1>
        <p className='mt-4 mb-8'>Calculate, Visualize, and Speak Your Math</p>
        <div className='flex space-x-4'>
          <div onClick={() => setIsActiveTab('Calculator')} className={`flex items-center justify-center w-fit md:w-48 p-2 text-center rounded-2xl font-bold cursor-pointer ${isActiveTab == 'Calculator' ?
            'text-white bg-blue-600' :
            'text-black bg-white border-2 border-gray-400'
            } `}>
            <CalculatorIcon className="h-8" color={isActiveTab == 'Calculator' ? '#fff' : '#000'} />
            <p className='hidden md:inline'>Calculator</p>
          </div>
          <div onClick={() => setIsActiveTab('Graph')} className={`flex items-center justify-center w-fit md:w-48 p-2 text-center rounded-2xl font-bold cursor-pointer ${isActiveTab == 'Graph' ?
            'text-white bg-blue-600' :
            'text-black bg-white border-2 border-gray-400'
            }`}>
            <GraphIcon className="h-8" color={isActiveTab == 'Graph' ? '#fff' : '#000'} />
            <p className='hidden md:inline'>Graph Visualizer</p>
          </div>
          <div onClick={() => setIsActiveTab('Speech')} className={`flex items-center justify-center w-fit md:w-48 p-2 text-center rounded-2xl font-bold cursor-pointer ${isActiveTab == 'Speech' ?
            'text-white bg-blue-600' :
            'text-black bg-white border-2 border-gray-400'
            }`}>
            <MicIcon className="h-8" color={isActiveTab == 'Speech' ? '#fff' : '#000'} />
            <p className='hidden md:inline'>Speech Calculator</p>
          </div>
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <div className='md:w-1/2 2xl:w-1/4 h-fit'>
          {isActiveTab == 'Calculator' && <Calculator />}
          {isActiveTab == 'Speech' && <Speech />}
        </div>
      </div>

      {isActiveTab == 'Graph' &&
        <div className='h-screen'>
          <Graph />
        </div>
      }

    </>

  )
}

export default App
