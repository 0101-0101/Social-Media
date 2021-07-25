import React from 'react'

function Search() {

    function searchProduct(e){
        e.preventDefault()
        console.log(e.target.value);
        const val = e.target.value
        fetch (`http://localhost:9000/search?value=${val}`, {
          method: 'POST',
            })
            .then (response => response.json ())
            .then (response => {
                console.log(response)
                // setProducts(response)
                // dispatch( { type:FETCH_DATA,payload: response } ) 
            })
            .catch (error => {
                console.error (error);
            });
      }

    return (
        <div>
            {/* <input type="text" onChange={searchProduct} name="search" placeholder="Search..."/> */}
            <p>okay</p>
        </div>
    )
}

export default Search

