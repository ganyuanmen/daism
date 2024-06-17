import Link from 'next/link'
import { useRouter } from "next/router";

export default function Breadcrumb({menu,currentPage}) {
    const { locale } = useRouter()
    const bstyle={
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display:"inline-block",
        maxWidth:'100px'
    }
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link href={`/${locale}/communities`}>Community</Link></li>
                {menu.map((obj, idx) => (
                    <li key={'Breadcrumb'+idx} className="breadcrumb-item"><Link href={`/${locale}${obj.url}`}><span style={bstyle} >{obj.title}</span></Link></li>
                    ))
                }
                <li className="breadcrumb-item active" aria-current="page"><span style={bstyle} > {currentPage}</span></li>
            </ol>
        </nav>                        
    );
}
