import MyIcon from "../../lib/jssvg/MyIcon"


export default function Icon() {
 
  return (
 <MyIcon />
  )
}

export const getServerSideProps  = ({ req, res,locale }) => {
 
  
    return {
      props: {
      }
    }
  }



  