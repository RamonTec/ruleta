export interface IoptionList {
  option: string;
  index: number;
  removeOption: (index: number) => void;
}

export const OptionsList: React.FC<IoptionList> = ({
  option,
  index,
  removeOption
}) => {
  return (
    <li key={index} className='flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors'>
      <span className='text-gray-800'>{option}</span>
      <button 
        onClick={() => removeOption(index)} 
        className='text-red-500 hover:text-red-700 font-medium transition-colors p-1 rounded hover:bg-red-50'
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  )
}