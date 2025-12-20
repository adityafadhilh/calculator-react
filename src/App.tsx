import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Calculator } from './components/Calculator';
import { Graph } from './components/Graph';
import { Speech } from './components/Speech';

function App() {
  const [isActiveTab, setIsActiveTab] = useState<'Calculator' | 'Graph' | 'Speech'>('Calculator');

  return (
    <>
      <div className='w-full mt-32 flex flex-col justify-center items-center'>
        <h1 className='text-5xl font-bold'>Calculator</h1>
        <p className='mt-4 mb-8'>Calculate, Visualize, and Speak Your Math</p>
        <div className='flex space-x-4'>
          <div onClick={() => setIsActiveTab('Calculator')} className={`w-48 p-2 text-center rounded-2xl font-bold cursor-pointer ${isActiveTab == 'Calculator' ?
            'text-white bg-blue-600' :
            'text-black bg-white border-2 border-gray-400'
            } `}>
            Calculator
          </div>
          <div onClick={() => setIsActiveTab('Graph')} className={`w-48 p-2 text-center rounded-2xl font-bold cursor-pointer ${isActiveTab == 'Graph' ?
            'text-white bg-blue-600' :
            'text-black bg-white border-2 border-gray-400'
            }`}>
            <p>Graph Visualizer</p>
          </div>
          <div onClick={() => setIsActiveTab('Speech')} className={`w-48 p-2 text-center rounded-2xl font-bold cursor-pointer ${isActiveTab == 'Speech' ?
            'text-white bg-blue-600' :
            'text-black bg-white border-2 border-gray-400'
            }`}>
            <p>Speech Calculator</p>
          </div>
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <div className='w-1/2 2xl:w-1/4 sm:w-2xl h-fit'>
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
