import Magnifier from '../assets/magnifier.svg'

const SearchInput = ({className='', ...props}: JSX.IntrinsicElements['input']) => {

    return (
        <div className={`input-search ${className}`}>
            <input  {...props}>
                
            </input>
            <img src={Magnifier} />
        </div>
    )
}


export {SearchInput}