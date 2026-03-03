import React, { useEffect, useState } from "react";

export default function GameStarFalls() {

    const [allStars, setAllStars] = useState<number[]>([])

    useEffect(() => {
        let newArr = Array.from({ length: 100 }, (_, index) => index + 1);
        setAllStars(newArr)
    }, [])





    return <React.Fragment>
        {allStars.map((item, index) => {

            return <React.Fragment key={item}>
                <svg className={'starFalls' + (index % 100)} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.79 11.1576C20.3426 11.6538 20.1805 12.558 19.49 12.8314L14.7082 14.7245C14.4585 14.8234 14.259 15.0185 14.1547 15.266L12.1365 20.0554C11.8403 20.7582 10.898 20.8841 10.4277 20.2837L7.29647 16.2861C7.12595 16.0684 6.8729 15.931 6.59745 15.9066L1.57351 15.4616C0.826023 15.3954 0.41507 14.5601 0.818771 13.9276L3.63653 9.51238C3.77845 9.29001 3.82675 9.02057 3.77092 8.76276L2.66237 3.6437C2.50355 2.91029 3.17908 2.26976 3.90301 2.46734L8.76866 3.79528C9.03544 3.86809 9.32045 3.82718 9.55597 3.68227L13.8809 1.02136C14.5304 0.621705 15.3703 1.0671 15.4039 1.82903L15.6328 7.02129C15.6446 7.28957 15.7638 7.54183 15.9636 7.72126L19.79 11.1576Z"
                        fill="#FF8D66" />
                </svg>


            </React.Fragment>
        })}




    </React.Fragment>

}