import { Text, TouchableOpacity, View } from "react-native";

export default function ConfirmMail() {
    return (
        <View>
            <Text>Confirme seu e-mail</Text>
            <Text>Enviamos um e-mail para você, confirme seu e-mail para continuar.</Text>
            <TouchableOpacity onPress={() => { }}>
                <Text>Reenviar e-mail</Text>
            </TouchableOpacity>
        </View>
        // <View style={styles.container}>
        //     <Text style={styles.title}>Confirme seu e-mail</Text>
        //     <Text style={styles.text}>Enviamos um e-mail para você, confirme seu e-mail para continuar.</Text>
        //     <TouchableOpacity style={styles.button} onPress={() => { }}>
        //         <Text style={styles.buttonText}>Reenviar e-mail</Text>
        //     </TouchableOpacity>
        // </View>
    );
}