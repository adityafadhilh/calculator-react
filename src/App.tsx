import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Calculator } from './components/Calculator';
import { Graph } from './components/Graph';
import { Speech } from './components/Speech';
import CalculatorIcon from './assets/icons/CalculatorIcon';
import GraphIcon from './assets/icons/GraphIcon';
import MicIcon from './assets/icons/MicIcon';

type TabId = 'Calculator' | 'Graph' | 'Speech';

type TabItemType = {
  id: TabId;
  label: string;
  icon: React.ReactNode;
};

function App() {
  const [isActiveTab, setIsActiveTab] = useState<TabId>('Calculator');

  const tabs: TabItemType[] = [
    {
      id: 'Calculator',
      label: 'Calculator',
      icon: <CalculatorIcon className="h-8" color={isActiveTab == 'Calculator' ? '#fff' : '#000'} />
    },
    {
      id: 'Graph',
      label: 'Graph Visualizer',
      icon: <GraphIcon className="h-8" color={isActiveTab == 'Graph' ? '#fff' : '#000'} />
    },
    {
      id: 'Speech',
      label: 'Speech Calculator',
      icon: <MicIcon className="h-8" color={isActiveTab == 'Speech' ? '#fff' : '#000'} />
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 text-gray-900 font-sans selection:bg-blue-100 pb-20">
        <div className='w-full pt-32 pb-12 flex flex-col justify-center items-center px-4'>
          {/* <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-sm animate-bounce">
            New ✨
          </div> */}
          <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4'>
            Calculator
          </h1>
          <p className='text-xl text-gray-600 text-center max-w-lg'>
            Calculate, Visualize, and Speak Your Math.
          </p>

          <nav className='flex flex-wrap justify-center gap-3 mt-12 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-xl'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setIsActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all cursor-pointer ${isActiveTab === tab.id ?
                  'text-white bg-blue-600 shadow-lg scale-105' :
                  'text-gray-600 hover:bg-gray-200/50'
                  }`}
              >
                <div className={isActiveTab === tab.id ? 'scale-110' : ''}>
                  {tab.icon}
                </div>
                <span className='hidden sm:inline'>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <main className='px-4 max-w-6xl mx-auto'>
          <div className='flex justify-center'>
            <div className='w-full lg:w-3/4 xl:w-2/3'>
              {(isActiveTab === 'Calculator' || isActiveTab === 'Speech') && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {isActiveTab === 'Calculator' ? <Calculator /> : <Speech />}
                </div>
              )}
            </div>
          </div>

          {isActiveTab === 'Graph' && (
            <div className='animate-in fade-in zoom-in-95 duration-500'>
              <Graph />
            </div>
          )}
        </main>
      </div>

    </>

  )
}

export default App
