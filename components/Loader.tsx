export default function Loader ({ show } : { show: boolean }){
    return show ? <div className="lds-dual-ring"></div> : null;
}