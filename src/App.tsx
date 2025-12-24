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

  useEffect(() => {
    document.body.style.zoom = "80%";

    return () => {
      document.body.style.zoom = "100%";
    };
  }, []);

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
      <div className='w-full mt-32 flex flex-col justify-center items-center'>
        <h1 className='text-5xl font-bold'>Calculator</h1>
        <p className='mt-4 mb-8'>Calculate, Visualize, and Speak Your Math</p>
        <div className='flex space-x-4'>
          {tabs.map((tab) => {
            return (
              <div key={tab.id} onClick={() => setIsActiveTab(tab.id)} className={`flex items-center justify-center w-fit md:w-48 p-2 text-center rounded-2xl font-bold cursor-pointer ${isActiveTab == tab.id ?
                'text-white bg-blue-600' :
                'text-black bg-white border-2 border-gray-400'
                } `}>
                {tab.icon}
                <p className='hidden md:inline'>{tab.label}</p>
              </div>
            )
          })}
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
