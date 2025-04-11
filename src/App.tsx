import { useState } from 'react';
import './App.css'
import { toast } from 'react-toastify';
import { OptionsList } from './components/optionList';
import confetti from 'canvas-confetti';

function App() {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [winnerOption, setWinnerOption] = useState<string | null>(null);

  const handleAddOption = () => {
    if (selectedOption?.trim() === '') {
      toast.error('No se puede agregar una opción vacía');
      return
    } else {
      if (selectedOption) {
        setOptions((prevOptions) => [...prevOptions, selectedOption]);
      }
      toast.info(`Opción "${selectedOption}" agregada`);
      setSelectedOption(null);
    }
  }

  const removeOption = (index: number) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
    toast.success(`Opción "${options[index]}" eliminada`);
  }

  const handleStartRoulette = () => {
    if (options.length === 0) {
      toast.info('Agrega opciones para iniciar la ruleta');
      return;
    }
    const randomIndex = Math.floor(Math.random() * options.length);
    const selected = options[randomIndex];
    setWinnerOption(selected);
    setModalVisible(true);
    handleCofetti();
  }

  const handleCofetti = () => {
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 }
    });
  }

  const handleClearOptions = () => {
    setOptions([]);
    toast.info('Opciones eliminadas');
  }

  return (
    <div className='mx-auto max-w-4xl p-6 bg-white rounded-xl shadow-lg'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-indigo-700 mb-2'>Ruleta</h1>
        <p className='text-gray-600'>Agrega opciones y selecciona una al azar</p>
      </div>

      <div className='flex gap-2 mb-8'>
        <input 
          className='flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all'
          type="text" 
          value={selectedOption || ''} 
          onChange={(e) => setSelectedOption(e.target.value)} 
          placeholder='Ingresa una opción...'
          onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
        />
        <button 
          onClick={handleAddOption}
          className='px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300'
          disabled={!selectedOption}
        >
          Agregar
        </button>
      </div>
      
      <div className='mb-8 text-center'>
        <button 
          onClick={handleStartRoulette}
          className='px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md disabled:bg-gray-400'
        >
          Girar Ruleta
        </button>
      </div>

      {options.length > 0 ? (
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>Opciones ({options.length})</h2>
            <button 
              onClick={() => handleClearOptions()} 
              className='text-red-500 hover:text-red-700 font-medium transition-colors'
            >
              Vaciar lista
            </button>
          </div>
          
          <ul className='space-y-2'>
            {options.map((option, index) => (
              <OptionsList
                key={index}
                option={option}
                index={index}
                removeOption={removeOption}
              />
            ))}
          </ul> 
        </div>
      ) : (
        <div className='text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500'>
          No hay opciones agregadas aún
        </div>
      )}

      {modalVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg text-center'>
            <h2 className='text-2xl font-bold text-indigo-700 mb-4'>¡Opción Ganadora!</h2>
            <p className='text-lg text-gray-800 mb-6'>{winnerOption}</p>
            <button 
              onClick={() => setModalVisible(false)} 
              className='px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;