import Magnifier from '../assets/magnifier.svg'

const SearchInput = ({className='', ...props}: JSX.IntrinsicElements['input']) => {

    return (
        <div className={`input-search ${className}`}>
            <input  {...props}>
                
            </input>
            <img alt='search' src={Magnifier} />
        </div>
    )
}


export {SearchInput}