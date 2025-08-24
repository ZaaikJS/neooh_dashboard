'use client'

import { Suspense } from "react";
import Main from "./panel/Main";
import Loading from "./components/Loading";

export default function Panel() {
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex justify-center items-center">
                <Loading />
            </div>
        }>
            <Main />
        </Suspense>
    );
}
