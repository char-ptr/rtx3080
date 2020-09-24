const url = 'https://api-prod.nvidia.com/direct-sales-shop/DR/products/en_gb/GBP/5438792800'
import * as permissions from "https://deno.land/std@0.70.0/permissions/mod.ts"

async function getData() {
    return new Promise(async (resolv,rej)=>{
        
        const perms = await permissions.grant([{ name: "net" }]);
        if (!perms) rej('Did not give permissions to perform a fetch req')
        let f = fetch(url)
        f.catch(rej2=>{
            console.log('Unable to fetch, r : ' + rej2)
            rej('Fetch Failed!')
        })
        f.then((v)=>{
            let jsn = v.json()
            jsn.catch(rej2=>{
                console.log('fetch had invalid jsn')
                rej2('fetch had invalid jsn')
            })
            jsn.then(val=>{
                resolv(val)
            })
        })

    })
}

function check() {
    
    let data = getData()
    data.then((value:any)=>{
        let defData = value.products.product[0]
        let inv = defData.inventoryStatus
        if (inv.status != 'PRODUCT_INVENTORY_OUT_OF_STOCK') {
            console.log('In stock!')
            // other code
        }
        else {
            console.log(`Out of stock, status : ${inv.status }`)
            // other code
        }
    })
    data.catch(rej=>console.log(`Got rejection promise from getData rejection : ${rej}`))

}
check()