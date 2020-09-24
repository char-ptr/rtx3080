const url = 'https://api-prod.nvidia.com/direct-sales-shop/DR/products/en_gb/GBP/5438792800'
import * as permissions from "https://deno.land/std@0.70.0/permissions/mod.ts"

let notif = `[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

$APP_ID = '110366bd-56e2-47ed-9bdf-3ce1fa408b6c'

$template = @"
<toast>
    <visual>
        <binding template="ToastText04">
            <text id="1">$("RTX 3080 is now on sale!")</text>
            <text id="2">$("Buy rn!")</text>
        </binding>
    </visual>
</toast>
"@

$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
$xml.LoadXml($template)
$toast = New-Object Windows.UI.Notifications.ToastNotification $xml
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($APP_ID).Show($toast)`; // using powershell is the fucking way


(async ()=>{

    const perms = await permissions.grant([{ name: "net" },{name:'run'}]);
    if (!(perms ? perms.length > 1 : false)) return console.log('Exiting,Did not give permissions to run script.')

    function showNotif() {
        Deno.run({
            cmd: ['powershell',notif]
        })
    }

    async function getData() {
        return new Promise(async (resolv,rej)=>{
            
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
                console.log('In stock! || '+inv.status)
                showNotif()
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
    setInterval(check,3e4)
    return
})()