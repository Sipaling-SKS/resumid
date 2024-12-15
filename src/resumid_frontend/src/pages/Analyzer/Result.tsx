import Layout from "@/components/layout"
import { useParams } from "react-router";

function Result() {
  const { id } = useParams();

  if (!id) {
    return (
      <Layout title="Error, result not found - Resumid">
        <h1>Error!</h1>
      </Layout>
    ) 
  }

  return (
    <Layout title="Resume Summary 15/12/2024 - Resumid">
      <h1>Resume Summary ID: {id}</h1>
    </Layout>
  )
}

export default Result;