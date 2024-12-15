import Layout from "@/components/layout"
import { Helmet } from "react-helmet";
import { useParams } from "react-router";

function Result() {
  const { id } = useParams();

  if (!id) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Error, result not found - Resumid</title>
        </Helmet>
        <main className="min-h-screen">
          <h1>Error!</h1>
        </main>
      </>
    ) 
  }

  return (
    <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Resume Summary 15/12/2024 - Resumid</title>
        </Helmet>
        <main className="min-h-screen">
          <h1>=Resume Summary ID: {id}</h1>
        </main>
      </>
  )
}

export default Result;