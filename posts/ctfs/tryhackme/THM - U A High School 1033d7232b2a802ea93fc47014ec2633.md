# THM - U.A. High School

![LOGO.png](THM%20-%20U%20A%20High%20School/LOGO.png)

Meu Primeiro Passo na maquina foi fazer um portscan utilizando o RustScan (ferramenta para scan de portas feita em Rust)

```bash

.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
The Modern Day Port Scanner.
________________________________________
: http://discord.skerritt.blog         :
: https://github.com/RustScan/RustScan :
 --------------------------------------
Scanning ports: The virtual equivalent of knocking on doors.

[~] The config file is expected to be at "/home/ihomuraa/.rustscan.toml"
[!] File limit is lower than default batch size. Consider upping with --ulimit. May cause harm to sensitive servers
[!] Your file limit is very small, which negatively impacts RustScan's speed. Use the Docker image, or up the Ulimit with '--ulimit 5000'. 
Open 10.10.121.136:22
Open 10.10.121.136:80
[~] Starting Script(s)
[~] Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-09-16 04:42 AKDT
Initiating Ping Scan at 04:42
Scanning 10.10.121.136 [2 ports]
Completed Ping Scan at 04:42, 0.25s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 04:42
Completed Parallel DNS resolution of 1 host. at 04:42, 0.20s elapsed
DNS resolution of 1 IPs took 0.20s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 04:42
Scanning 10.10.121.136 [2 ports]
Discovered open port 80/tcp on 10.10.121.136
Discovered open port 22/tcp on 10.10.121.136
Completed Connect Scan at 04:42, 0.28s elapsed (2 total ports)
Nmap scan report for 10.10.121.136
Host is up, received syn-ack (0.26s latency).
Scanned at 2024-09-16 04:42:13 AKDT for 0s

PORT   STATE SERVICE REASON
22/tcp open  ssh     syn-ack
80/tcp open  http    syn-ack

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 0.78 seconds
```

Nenhuma Porta diferente Aberta, então partir a analisar a aplicação web e enumerar a maquina utilizando o Feroxbuster e o Dirsearch.

A razão pelo qual usei o feroxbuster e o dirsearch ao mesmo tempo é porque o feroxbuster automaticamente ja começa a escanear outros diretorios encima dos diretorios que ele ja encontrou exemplo,
quando ele acha o [http://xxxx/assets](http://xxxx/assets) ele em vez de parar, ele continua a buscar outros diretorios encima deste, [http://xxxx/assets/images](http://xxxx/assets/images) e etc.
ja o dirsearch é um pouco mais lentos que os outros enumeradores de diretorios mas ele tem uma caracteristica unica que é sua wordlist, a wordlist do dirsearch é uma das maiores e mais completas wordlists pra fuzzing em diretorios, por isso sempre recomendo rodar ele junto de outro scan de diretorios com feroxbuster ou gobuster.

```bash

                                                                                                                                
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.4
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://10.10.121.136
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.4
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 🏁  HTTP methods          j│ [GET]
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
403      GET        9l       28w      278c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       31w      275c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       87l      261w     2580c http://10.10.121.136/courses.html
200      GET       71l      205w     2056c http://10.10.121.136/contact.html
200      GET      166l      372w     2943c http://10.10.121.136/assets/styles.css
200      GET       63l      287w     2573c http://10.10.121.136/admissions.html
200      GET       52l      320w     2542c http://10.10.121.136/about.html
200      GET       61l      225w     1988c http://10.10.121.136/
301      GET        9l       28w      315c http://10.10.121.136/assets => http://10.10.121.136/assets/
200      GET        0l        0w        0c http://10.10.121.136/assets/
301      GET        9l       28w      322c http://10.10.121.136/assets/images => http://10.10.121.136/assets/images/
[####################] - 5m     90011/90011   0s      found:9       errors:68     
[####################] - 5m     30000/30000   99/s    http://10.10.121.136/ 
[####################] - 5m     30000/30000   100/s   http://10.10.121.136/assets/ 
[####################] - 5m     30000/30000   98/s    http://10.10.121.136/assets/images/     
    
```

```bash
dirsearch -u http://10.10.20.237/assets/index.php
  _|. _ _  _  _  _ _|_    v0.4.3
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET
Threads: 25 | Wordlist size: 11460

Output File: /home/reaper64x/reports/http_10.10.20.237/_assets_index.php_24-09-16_06-15-14.txt

Target: http://10.10.20.237/

[06:15:14] Starting: assets/index.php/
[06:15:33] 404 -  274B  - /assets/index.php/%2e%2e//google.com
[06:18:50] 200 -   40B  - /assets/index.php/p_/webdav/xmltools/minidom/xml/sax/saxutils/os/popen2?cmd=dir

```

Como citei, o feroxbuster não apontou esse diretorio em seu scan, mas o dirsearch sim.

Claramente isso se trata de RCE (remote code execution) uma falha que permite o atacante executar comandos indevidos dentro de uma aplicação qual ele não deveria. essa falha é classificada como nivel critical tendo CVV de 9.9 em alguns casos.

![url.png](THM%20-%20U%20A%20High%20School/url.png)

Aplicação retornou uma saida em base64, apos decodificar vi que era a saida do comando confirmando realmente que era um RCE.

![base64.png](THM%20-%20U%20A%20High%20School/base64.png)

![decode.png](THM%20-%20U%20A%20High%20School/decode.png)

após isso ja partir a tentar conseguir uma Reverse shell na maquina.

![shell.png](THM%20-%20U%20A%20High%20School/shell.png)

Pra gerar a shell eu utilizei o site: [https://www.revshells.com/](https://www.revshells.com/) e utilizei a shell nc mkfifo em url encode e passei no parametro cmd= da url. 

![nc.png](THM%20-%20U%20A%20High%20School/nc.png)

Primeiros passos concluido, Estamos dentro da maquina Alvo, agora basta fazer um reconhecimento e mapear vetores de escalação de privilegios presente para conseguims alcançar o user Root.

olhando a maquina encontrei uma senha em base64 apos decodar tentei utilizar ela em todos os lugares possiveis mas nada, então decidi voltar a olhar a maquina.

![pass.png](THM%20-%20U%20A%20High%20School/pass.png)

![decodepass.png](THM%20-%20U%20A%20High%20School/decodepass.png)

vasculhando a maquina encontrei uma imagem chamada oneforall.jpeg, tentei extrair metadados dela usando o algumas ferramentas mas não consegui, então parti a analisar o seu hexadecimal

analisando o hexadecimal da imagem encontrei um problema na header do hex, então modifiquei ele arrumando pra header do jpeg e tentei novamente tentar extrair os metadados, mas nada novamente, buscando qual poderia ser o problema encontrei a possibilidade de ser um magicbyte (uma sequência específica de bytes que aparece no início de um arquivo e serve para identificar seu formato ou tipo)

![hex.png](THM%20-%20U%20A%20High%20School/hex.png)

![Screenshot_30-Sep_11-22-15_5650.png](THM%20-%20U%20A%20High%20School/Screenshot_30-Sep_11-22-15_5650.png)

então busquei no github uma ferramenta para lidar com essa questão magicbyte.

![magibyte.png](THM%20-%20U%20A%20High%20School/magibyte.png)

Finalmente tornando possivel extrair o metadados da imagem, na hora da extração foi requisitado uma senha então utilizei aquela senha que havia encontrado antes e consegui acesso ao primeiro user da maquina, Deku.

![cred.png](THM%20-%20U%20A%20High%20School/cred.png)

![deku.png](THM%20-%20U%20A%20High%20School/deku.png)

após logar no user deku fui direto pro diretorio home do user e peguei a flag user.txt, apos isso  dei um "sudo -l" 

![root.png](THM%20-%20U%20A%20High%20School/root.png)

Então fui verificar oque seria esse "[feedback.sh](http://feedback.sh/)" e pra minha surpresa era um script com privilegios elevados qual permitia eu executar comandos.

então eu criei um cronjob para enviar a flag root para um arquivo legivel para meu usuario. 

![rootf.png](THM%20-%20U%20A%20High%20School/rootf.png)

Easy piece, ctf zerado.

**By Enzo santana (0xEnzoSantana)**