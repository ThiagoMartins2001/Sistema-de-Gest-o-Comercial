package CodingTechnology.SistemaDeGestao.Produtos.model.enums;

public enum UnidadeMedida {
    KG,
    G,
    MG,
    L,
    ML,
    UN;

    public double converterPara(UnidadeMedida destino, double valor) {
        if (this == destino)
            return valor;

        // Converter para unidade base (G ou ML)
        double valorBase;
        switch (this) {
            case KG:
                valorBase = valor * 1000;
                break;
            case G:
                valorBase = valor;
                break;
            case MG:
                valorBase = valor / 1000;
                break;
            case L:
                valorBase = valor * 1000;
                break;
            case ML:
                valorBase = valor;
                break;
            case UN:
                return valor; // Não converte UN para peso/volume
            default:
                return valor;
        }

        // Converter da base para destino
        switch (destino) {
            case KG:
                return valorBase / 1000;
            case G:
                return valorBase;
            case MG:
                return valorBase * 1000;
            case L:
                return valorBase / 1000;
            case ML:
                return valorBase;
            case UN:
                return valor; // Não converte Peso/Volume para UN
            default:
                return valor;
        }
    }
}
