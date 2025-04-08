import Link from 'next/link';

function Error({ statusCode }) {
    return ( <
        div className = "container flex h-[calc(100vh-200px)] flex-col items-center justify-center" >
        <
        h1 className = "mb-4 text-4xl font-bold" > {
            statusCode ?
            `An error ${statusCode} occurred on server` :
                'An error occurred on client'
        } <
        /h1> <
        p className = "mb-8 text-muted-foreground" >
        We encountered an error
        while processing your request. <
        /p> <
        div className = "flex gap-4" >
        <
        Link href = "/"
        className = "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90" >
        Return Home <
        /Link> <
        /div> <
        /div>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;