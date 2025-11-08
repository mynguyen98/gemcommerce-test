import { UnitValue } from './components/UnitValue';

const App = () => {
  const handleChange = (data: { value: number; unit: string }) => {
    console.log('Unit:', data.unit, '| Value:', data.value);
  };

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center ">
      <div className="w-full flex gap-5 flex-col justify-center items-center max-w-2xl bg-neutral-800 p-8 rounded-lg ">
        <h1 className='text-2xl font-semibold text-gray-100'>Nguyễn Cảnh Mỹ</h1>
        <h1 className='text-xl font-semibold text-gray-400'>Gemcommerce test</h1>
        <UnitValue onChange={handleChange} />
      </div>
    </div>
  );
};

export default App;
