import { Request } from 'express';

export class Pagination {

    static paginate( perPage: number, currentPage: number, totalCount: number, req: Request ) {
        try {
            const path = `${ req.protocol }://${ req.get( 'host' ) }${ req.originalUrl }`;

            const lastPage = Math.ceil( totalCount / perPage );
            const firstPageUrl = Pagination.replacePage( 1, path );
            const lastPageUrl = Pagination.replacePage( lastPage, path );
            let nextPage = null;
            let prevPage = null;
            let nextPageUrl = null;
            let prevPageUrl = null;

            if ( currentPage < lastPage ) {
                nextPage = currentPage + 1;
                nextPageUrl = Pagination.replacePage( nextPage, path );
            }

            if ( currentPage > 1 ) {
                prevPage = currentPage - 1;
                prevPageUrl = Pagination.replacePage( prevPage, path );
            }

            return {
                perPage,
                lastPage,
                totalCount,
                currentPage,
                nextPage,
                prevPage,
                firstPageUrl,
                lastPageUrl,
                nextPageUrl,
                prevPageUrl,
            };
        } catch ( error ) {
            return { skip: 0, limit: 10 };
        }
    }

    private static replacePage( page: number, path: string ) {
        return path.replace( /page=\d+/g, `page=${ page }` );
    }

}
