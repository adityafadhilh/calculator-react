import Plot from 'react-plotly.js';
import { compile } from 'mathjs';
import { useEffect, useState } from 'react';

type XRangeType = {
    min: number,
    max: number
}

export function Graph() {
    const [equation, setEquation] = useState('');
    const [range, setRange] = useState<XRangeType>({
        min: -10,
        max: 10
    });
    const [error, setError] = useState<boolean>(false);
    const [x, setX] = useState<any>([]);
    const [y, setY] = useState<any>([]);

    const generatePlot = () => {
        try {
            const expression = compile(equation);

            console.log(expression);

            const x = [];
            const y = [];

            for (let i = range.min; i <= range.max; i++) {
                x.push(i);
                y.push(expression.evaluate({ x: i }));
            };

            setX(x);
            setY(y);
            setError(false);
        } catch (error) {
            setError(true);
        }
    };

    useEffect(() => {
        generatePlot();
    }, [equation])

    useEffect(() => {
        generatePlot();
    }, [range])

    return (
        <div className="shadow-gray-400 shadow-2xl inset-shadow-2xs w-full h-fit rounded-2xl p-4 mt-10">
            <h3 className="text-xl font-bold mb-4">Graph Visualizer</h3>
            <p className="block mb-2">{'Equation (use "x" as variable):'}</p>
            <input
                className="border-2 border-gray-400 rounded-md w-full p-2"
                onChange={(e) => {
                    setEquation(e.target.value);
                }}
            />
            {error && <span className='text-red-500'>Please input valid equation</span>}
            <div className="flex space-x-4 mt-4">
                <div className="flex-1">
                    <p className="mb-2">{'Min X:'}</p>
                    <input
                        type='number'
                        onChange={(e) => {
                            setRange({
                                ...range,
                                min: parseInt(e.target.value)
                            });
                        }}
                        value={range.min || ''}
                        className="border-2 border-gray-400 rounded-md w-full p-2" />
                </div>
                <div className="flex-1">
                    <p className="mb-2">{'Max X:'}</p>
                    <input
                        type='number'
                        onChange={(e) => {
                            setRange({
                                ...range,
                                max: parseInt(e.target.value)
                            });
                        }}
                        value={range.max || ''}
                        className="border-2 border-gray-400 rounded-md w-full p-2" />
                </div>
            </div>
            <p className="my-2">{'Preset Equations:'}</p>
            <div className="flex space-x-3 pt-2">
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Quadratic</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Cubic</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Sine</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Cosine</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Exponential</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Logarithm</div>
            </div>
            {/* <div className="bg-blue-600 w-full mt-4 text-white p-2 font-bold text-center rounded-2xl">
                Generate Graph
            </div> */}
            <div className="border-2 border-gray-400 min-h-96 mt-4 rounded-2xl resize-y overflow-auto">
                <Plot
                    data={[
                        {
                            x,
                            y,
                            type: "scatter",
                            mode: "lines",
                            name: `y = ${equation}`,
                        },
                    ]}
                    layout={{
                        title: { text: `${equation}` },
                        xaxis: { title: { text: "x" } },
                        yaxis: { title: { text: "y" } },
                        autosize: true,
                    }}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    )
}