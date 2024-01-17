const GroupLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return ( 
        <div className="h-full bg-sky-800 text-white">
            {children}
        </div>
     );
}
 
export default GroupLayout;