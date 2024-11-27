export default function Loadding({size='lg'}) {
    return (
        <div className={size==='sm'?'':"fs-3 p-5"}  ><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...</div>
    )
}
