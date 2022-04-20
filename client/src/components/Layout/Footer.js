import React from 'react'

export default function footer() {
    return (
        <div>
             <footer className="bg-dark text-white p-4 text-center">
            Copyright &copy; {new Date().getFullYear()} Social App
        </footer>
        </div>
    )
}

