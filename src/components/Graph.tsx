import Plot from 'react-plotly.js';
import { compile } from 'mathjs';
import { useEffect, useMemo, useState } from 'react';
import { EQUATIONS } from '../helpers/equations';
import ChevronDownIcon from '../assets/icons/ChevronDownIcon';
import ChevronUpIcon from '../assets/icons/ChevronUpIcon';

type XRangeType = {
    min: number,
    max: number
}

export function Graph() {
    const [equation, setEquation] = useState('x^2');
    const [range, setRange] = useState<XRangeType>({
        min: -10,
        max: 10
    });
    const [activeMode, setActiveMode] = useState<'lines' | 'markers'>('lines');
    const [showPreset, setShowPreset] = useState<boolean>(true);

    const plotData = useMemo(() => {
        try {
            const expression = compile(equation);
            const x: number[] = [];
            const y: number[] = [];

            // Increase resolution for smoother lines
            const step = (range.max - range.min) / 100;
            for (let i = range.min; i <= range.max; i += Math.max(0.1, step)) {
                x.push(i);
                try {
                    const result = expression.evaluate({ x: i });
                    y.push(typeof result === 'number' ? result : NaN);
                } catch {
                    y.push(NaN);
                }
            }

            return { x, y, error: false };
        } catch (error) {
            return { x: [], y: [], error: true };
        }
    }, [equation, range]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowPreset(true);
            } else {
                setShowPreset(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const _equationsPreset = () => {
        return (
            <div className="flex flex-wrap gap-2 pt-2">
                <div className='flex justify-center w-full md:hidden' onClick={() => setShowPreset(!showPreset)}>
                    {showPreset ? <ChevronUpIcon className='h-4' /> : <ChevronDownIcon className='h-4' />}
                </div>
                {showPreset && Object.entries(EQUATIONS).map(([key, eq]) => (
                    <button
                        key={key}
                        className="bg-gray-200 rounded-xl px-4 py-2 text-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setEquation(eq.expression)}
                    >
                        {eq.label}
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className='flex flex-col md:flex-row w-full h-fit md:h-[calc(100vh-200px)] mt-10 px-4 md:px-10 pb-10 gap-8'>
            <div className="shadow-2xl rounded-2xl p-6 flex-1 w-full bg-white overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6">Graph Visualizer</h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Equation (use "x" as variable)
                    </label>
                    <input
                        className={`border-2 rounded-xl w-full p-3 font-mono text-lg focus:outline-hidden focus:ring-2 ${plotData.error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                            }`}
                        onChange={(e) => setEquation(e.target.value)}
                        value={equation}
                        placeholder="e.g. x^2 + 2x + 1"
                    />
                    {plotData.error && <p className='text-red-500 text-sm mt-2'>Please input a valid equation</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min X</label>
                        <input
                            type='number'
                            onChange={(e) => setRange(prev => ({ ...prev, min: parseFloat(e.target.value) || 0 }))}
                            value={range.min}
                            className="border-2 border-gray-200 rounded-xl w-full p-3 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max X</label>
                        <input
                            type='number'
                            onChange={(e) => setRange(prev => ({ ...prev, max: parseFloat(e.target.value) || 0 }))}
                            value={range.max}
                            className="border-2 border-gray-200 rounded-xl w-full p-3 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
                    {_equationsPreset()}
                </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-3xl flex-2 w-full p-6 shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Visualization</h4>
                    <select
                        className='border-2 border-gray-200 p-2 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-200'
                        value={activeMode}
                        onChange={(e) => setActiveMode(e.target.value as any)}
                    >
                        <option value='lines'>Smooth Lines</option>
                        <option value='markers'>Scatter Points</option>
                    </select>
                </div>

                <div className="flex-1 min-h-[400px]">
                    <Plot
                        data={[
                            {
                                x: plotData.x,
                                y: plotData.y,
                                type: "scatter",
                                mode: activeMode,
                                name: `y = ${equation}`,
                                line: { shape: 'spline', color: '#2563eb', width: 3 },
                                marker: { color: '#2563eb', size: 6 }
                            },
                        ]}
                        layout={{
                            margin: { t: 40, r: 20, l: 40, b: 40 },
                            xaxis: { title: { text: "x" }, gridcolor: '#f1f5f9' },
                            yaxis: { title: { text: "y" }, gridcolor: '#f1f5f9' },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            autosize: true,
                            hovermode: 'closest'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                        config={{ responsive: true, displayModeBar: false }}
                    />
                </div>
            </div>
        </div>
    )
}
