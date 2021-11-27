import React from 'react';
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps<{
    number: string;
}>;

export const NotFound: React.VFC = () => {
    return (
        <React.Fragment>
            <h1>404 Not Found</h1>
        </React.Fragment>
    )
}

export const Error: React.VFC<Props> = (props) => {
    return <NotFound />
}