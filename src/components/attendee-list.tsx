import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react"
import { IconButton } from "./icon-button"
import { Table } from "./table/table"
import { TableHeader } from "./table/table-header"
import { TableCell } from "./table/table-cell"
import { TableRow } from "./table/table-row"
//import { attendees } from "../data/attendees"
import dayjs from "dayjs"
import  relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { ChangeEvent, useEffect, useState } from "react"

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee{
    id: string,
    name: string,
    email: string,
    createdAt: string,
    checkedInAt: string | null
}


export function AttendeeList(){
    const [search,setSearch] = useState(()=>{
        const url = new URL(window.location.toString())
        if(url.searchParams.has('query')){
            return url.searchParams.get('query') ?? ''
        }
        return ''
    })
    const [page, setPage] = useState(()=>{
        const url =  new URL(window.location.toString())
        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page') ?? '')
        }
        return 0
    })
    const [total,setTotal] = useState(0)
    const [attendees,setAttendess] = useState<Attendee[]>([])
    const totalPages = Math.ceil(total/10)
    //const page = 1

    useEffect(()=>{
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
        url.searchParams.set('pageIndex',String(page))
        url.searchParams.set('query',search)
        fetch(url)
        .then(response => response.json())
        .then(data => {
        setAttendess(data.attendees) 
        setTotal(data.total)})
    },[page,search])

    function onSearchInputChange(event:ChangeEvent<HTMLInputElement>){
        setCurrentSearch(event.target.value)
        setPage(0)

    }

    function setCurrentSearch(search:string){
        const url = new URL(window.location.toString())
        url.searchParams.set('query',search)
        window.history.pushState({},'',url)
        setSearch(search)
    }

    function setCurrentPage(page:number){
        const url = new URL(window.location.toString())
        url.searchParams.set('page', String(page))
        window.history.pushState({},'',url)
        setPage(page)
    }

    function goToFirstPage(){
        setCurrentPage(0)
    }

    function goToPreviousPage(){
        setCurrentPage(page-1)
    }

    function goToNextPage(){
        setCurrentPage(page+1)
    }

    function goToLastPage(){
        setCurrentPage(totalPages-1)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
                    <Search className="size-4 text-emerald-300"/>
                    <input type="text" placeholder="Buscar participante..." className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" value={search} onChange={(e)=>onSearchInputChange(e)}/>
                </div>
            </div>

            <Table>
                <thead>
                    <tr className="border-b border-white/10">
                        <TableHeader style={{ width:48 }} >
                            <input type="checkbox" className="size-4 bg-black/20  rounded border border-white/10" />
                        </TableHeader>
                        <TableHeader >Código</TableHeader>
                        <TableHeader >Participante</TableHeader>
                        <TableHeader >Data de inscrição</TableHeader>
                        <TableHeader >Data de check-in</TableHeader>
                        <TableHeader style={{ width:64 }} ></TableHeader>
                    </tr>
                </thead>
                <tbody>
                {attendees.map((attendee)=>{
                        return (
                            <TableRow key={attendee.id} >
                                <TableCell>
                                    <input type="checkbox" className="size-4 bg-black/20  rounded border border-white/10" />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1"> 
                                        <span className="font-semibold text-white">{attendee.name}</span> 
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{(attendee.checkedInAt===null)
                                ?<span className="text-zinc-400">Não fez check-in</span>
                                :dayjs().to(attendee.checkedInAt)}
                                </TableCell>
                                <TableCell> 
                                    <IconButton transparent type="button" >
                                        <MoreHorizontal className="size-4"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}

                    
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>Mostrando {attendees.length} de {total}</TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">
                                <span>Página {page+1} de {totalPages}</span>
                        
                                <div className="flex gap-1.5 " >
                                    <IconButton type="button" disabled={page===0} onClick={goToFirstPage} >
                                        <ChevronsLeft className="size-4"  />
                                    </IconButton>
                                    <IconButton type="button" onClick={goToPreviousPage} disabled={page===0}>
                                        <ChevronLeft className="size-4"/>
                                    </IconButton>
                                    <IconButton type="button" onClick={goToNextPage} disabled={page===totalPages-1} >
                                        <ChevronRight className="size-4"/>
                                    </IconButton>
                                    <IconButton type="button" onClick={goToLastPage} disabled={page===totalPages-1}>
                                        <ChevronsRight className="size-4"/>
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}