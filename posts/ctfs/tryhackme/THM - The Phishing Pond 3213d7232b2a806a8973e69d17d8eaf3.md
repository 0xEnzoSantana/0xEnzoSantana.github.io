# THM - The Phishing Pond

![2026-03-12_08-02.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-02.png)

```jsx
Phishing
is a type of scam where attackers try to abuse your trust in order to 
trick you into giving away personal information, passwords, or even 
money. These messages often look real and convincing, which is why phishing
 is so common and effective. In fact, it’s one of the most widespread 
ways attackers break into accounts or steal data, because it targets 
people directly rather than trying to hack computers.
It is important for us to be able to identify common strategies used by attackers when creating phishing campaigns. Such tactics include, but aren't limited to:
Urgency & scare tactics: Subject lines like "Immediate action required" are designed to pressure you.Look-alike sender addresses: Fake domains with tiny changes (e.g., rnicrosoft.com instead of microsoft.com).Display name impersonation: Sender name looks familiar, but the email address doesn’t match.Malicious attachments: Files (DOC/XLS/ZIP) asking you to “enable macros” or containing malware.Compromised real accounts: Emails from hacked accounts that look legitimate but have odd requests.Too-good-to-be-true offers: Fake prizes, refunds, or job opportunities requiring personal details.
Now it's your turn to put this into practice. You will be presented 
with a series of emails and will be required to identify if they are phishing emails or not. At the end of the game, you will find the flag required to answer the question.
Start the VM by clicking the Start Machine button below.
```

![2026-03-12_08-04.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-04.png)

Nível 1
Convite pra conferência de segurança da TryHackMe.
→ Legítimo. Domínio certinho ([tryhackme.com](http://tryhackme.com/)), nada forçado, tom normal.

![2026-03-12_08-04_1.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-04_1.png)

Nível 2
E-mail de benefícios e recursos internos.
→ Legítimo. Remetente da empresa, link pra página interna, sem pressa nem coisa estranha.

![2026-03-12_08-04_2.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-04_2.png)

Nível 3
Documento anexado pedindo pra habilitar macros.
→ Phishing. Macro em anexo + remetente esquisito

![2026-03-12_08-05.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-05.png)

Nível 4
Aviso de manutenção de infraestrutura no fim de semana.
→ Legítimo, sem anexo nem link suspeito.

![2026-03-12_08-05_1.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-05_1.png)

Nível 5
Fatura/invoice com instrução pra habilitar macros no anexo.
→ Phishing. Anexo + macro + valor em dinheiro + remetente falso.

![2026-03-12_08-06.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-06.png)

Nível 6
Oferta de emprego perfeita pedindo RG, dados bancários logo de cara.
→ Phishing. Ninguém pede conta bancária no e-mail de recrutamento. Nunca.

![2026-03-12_08-06_1.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-06_1.png)

Nível 7
Alerta urgente do banco: “conta vai ser bloqueada AGORA, clique já!”
→ Phishing. Urgência extrema + remetente duvidoso + link malicioso.

![2026-03-12_08-06_2.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-06_2.png)

Nível 8
Atualização semanal de projeto interno da equipe.
→ Legítimo. Remetente da empresa, tom corporativo tranquilo, sem pedir nada estranho.

![2026-03-12_08-07.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-07.png)

Nível 9
E-mail de “correção de pagamento” com nome conhecido, mas e-mail @gmail.com.
→ Phishing. Nome de exibição familiar, mas o endereço real não tem nada a ver com a empresa.

![2026-03-12_08-08_1.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-08_1.png)

Nível 10
“Parabéns! Você foi selecionado pro reembolso de R$ 2.000, me passa seus dados bancários.”
→ Phishing. “Você ganhou” + pedido de dados bancários + remetente genérico.

![2026-03-12_08-08_3.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-08_3.png)

![image.jpg](THM%20-%20The%20Phishing%20Pond/image.jpg)

![2026-03-12_08-09_1.png](THM%20-%20The%20Phishing%20Pond/2026-03-12_08-09_1.png)

E aqui finalizamos a room. Foi algo bem simples, basicamente um exercício rápido pra conscientizar sobre os modelos mais comuns de phishing. Pra não deixar a mão tão vazia, vou abordar uma técnica um tanto interessante chamada homoglyph attacks (ou ataques de homoglifos). Essa técnica se baseia em usar caracteres da tabela Unicode que são visualmente muito parecidos com letras da tabela ASCII padrão. 

Letra "a" latina **(a)** → substituída pelo alpha grego minúsculo **(α)**
Exemplo: αpple.com (parece "apple.com")

Letra "o" latina **(o)** → substituída pelo ômicron grego **(ο)** ou pelo o cirílico **(о)**
Exemplo: gοogle.com ou micrοsoft.com (parece "google.com" e "microsoft.com")

Letra "n" latina **(n)** → substituída pelo hiragana **ん** (um caractere japonês)
Exemplo: baんk.com (parece "bank.com")

Letra "l" minúscula (l) → substituída pela letra palochka cirílica (ӏ) ou por "I" maiúsculo 
Exemplo: paypaӏ.com (parece "paypal.com")

Letra "i" minúscula (i) → substituída pelo i cirílico (і)

e assim segue o padrão…

```
Homoglyphs comuns usados em ataques de phishing:

a: [а, ɑ, ⱥ]
  • а (Cyrillic a - U+0430)
  • ɑ (IPA alpha - U+0251)
  • ⱥ (Latin a with stroke - U+2C65)

e: [е, ė, ë]
  • е (Cyrillic e - U+0435)
  • ė (Latin e with dot above - U+0117)
  • ë (Latin e with diaeresis - U+00EB)

i: [і, ǐ, ı]
  • і (Cyrillic i - U+0456)
  • ǐ (Latin i with caron - U+01D0)
  • ı (Latin small dotless i - U+0131)

o: [о, ø, õ]
  • о (Cyrillic o - U+043E)
  • ø (Latin o with stroke - U+00F8)
  • õ (Latin o with tilde - U+00F5)

y: [у, ү, ÿ]
  • у (Cyrillic u - U+0443)
  • ү (Cyrillic straight u - U+04AF)
  • ÿ (Latin y with diaeresis - U+00FF)

c: [с, ċ, č]
  • с (Cyrillic es - U+0441)
  • ċ (Latin c with dot above - U+010B)
  • č (Latin c with caron - U+010D)

m: [м, ṃ]
  • м (Cyrillic em - U+043C)
  • ṃ (Latin m with dot below - U+1E47)

t: [т, ţ]
  • т (Cyrillic te - U+0442)
  • ţ (Latin t with cedilla - U+0163)

s: [ѕ, š]
  • ѕ (Cyrillic dze - U+0455)
  • š (Latin s with caron - U+0161)

n: [ñ, ń]
  • ñ (Latin n with tilde - U+00F1)
  • ń (Latin n with acute - U+0144)

g: [ɡ, ğ]
  • ɡ (IPA script g - U+0261)
  • ğ (Latin g with breve - U+011F)

u: [μ, ü]
  • μ (Greek small mu - U+03BC)
  • ü (Latin u with diaeresis - U+00FC)

d: [ð, đ]
  • ð (Icelandic eth - U+00F0)
  • đ (Latin d with stroke - U+0111)
```