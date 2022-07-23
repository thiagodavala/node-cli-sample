# Simple NODE-CLI Sample
> Instruções de uso

## Descrição

Simples aplicação utilizando node com linha de commando usando o módulo yargs.


## Fase 1 (Docker)


1. Build da imagem local

O container no cluster K8S, se for utilizar o minikube local, lembre-se que é necessário fazer o minikube enxergar as imagens buildadas localmente, no Windows pode-se utlizar no powershell o comando a seguir ([doc oficial](https://minikube.sigs.k8s.io/docs/handbook/pushing/#1-pushing-directly-to-the-in-cluster-docker-daemon-docker-env))

Se o minikube não conseguir chegar na imagem é provavel que os pods ao serem lançados ficaram com o status "ImagePullBackOff"

```
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

```
docker build -t node-cli-sample .
```

2. Rodar a imagem localmente

```
docker run --name node-cli -d node-cli
```

3. Visualizar o log do container
```
docker logs -f node-cli
```

4. Verificar que o container não está mais ativo
```
docker ps
```



## Fase 2 (Minikube ou outro K8s)


1. Análise do arquivo kube/cronjob.yaml

```
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: node-cli-sample
spec:
  schedule: "*/1 * * * *" 
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: node-cli-sample
            image: node-cli-sample
            imagePullPolicy: IfNotPresent
          restartPolicy: OnFailure
```

spec.schedule: o crontab.guru ajuda nesse processo https://crontab.guru/

image: nome da imagem buildada localmente, no caso do kubernetes gerenciado, utilizar o endereço do container-registry

Sempre que necessário incluir o atributo **concurrencyPolicy** como **Forbid** para impedir que um job possa ser criado enquanto outro ainda estiver em execuçao, mais detalhes em [Cronjobs K8S](https://kubernetes.io/pt-br/docs/concepts/workloads/controllers/cron-jobs/)

2. Aplicar o cronjob.yaml

```
kubectl apply -f kube/cronjob.yaml
```

3. Visualizar o cronjob.yml

```
kubectl get cronjob
```

Obs: para observar a criação dos job ativos, pode usar 'kubectl get cronjob --watch'

4. Observar os container criados:

```
kubectl get pods
```

5. Observar os logs criados nos pods

```
kubectl logs -f node-cli-sample-XXXXX
```
