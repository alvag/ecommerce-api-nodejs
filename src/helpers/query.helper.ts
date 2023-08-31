export class QueryFilter {

    static productQuery( query: any ) {
        try {
            const { brand, category, maxPrice, minPrice, title, color } = query;

            return {
                ...( title ? { title: { $regex: title, $options: 'i' } } : {} ),
                brand: brand ? brand : { $ne: null },
                category: category ? category : { $ne: null },
                ...( maxPrice && !minPrice ? { price: { $lte: maxPrice } } : {} ),
                ...( minPrice && !maxPrice ? { price: { $gte: minPrice } } : {} ),
                ...( minPrice && maxPrice ? { price: { $gte: minPrice, $lte: maxPrice } } : {} ),
                color: color ? color : { $ne: null },
            };
        } catch ( error ) {
            return {};
        }
    }

    static sortFilter( sort: string ) {
        try {
            if ( !sort ) return '';
            const [ field, dir ] = sort.split( ',' );
            return `${ dir === 'desc' ? '-' : '' }${ field }`;
        } catch ( error ) {
            return '';
        }
    }
}
