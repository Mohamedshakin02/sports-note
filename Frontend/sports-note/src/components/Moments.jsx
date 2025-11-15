import React from 'react'

function Moments() {
  const momentsList = [
        {
            image: "",
            title: "Epic Win",
            description: "Relive the thrilling victory from last season's championship game."
        },
        {
            image: "",
            title: "Training Day",
            description: "Capture the hard work and dedication from your best practice sessions."
        }
    ];

    return (
        <section className='moments-section container-md'>
            <div className='heading-container d-flex justify-content-between mb-5'>
                <h1 className='m-0 p-0'>Moments</h1>

                <p className='m-0 p-0'>
                    Keep and enjoy your best sports moments. Remember the exciting games and achievements that made you proud.
                </p>
            </div>

            <div className='moments-container'>
                {momentsList.map((moment, index) => (
                    <div className='moment-box' key={index}>
                        <div className='moment-image'>
                            {/* <img className='img-fluid' src={moment.image} alt={moment.title} /> */}
                        </div>
                        <div className='moment-content'>
                            <h2 className='m-0 p-0'>{moment.title}</h2>
                            <p className='m-0 p-0'>{moment.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Moments