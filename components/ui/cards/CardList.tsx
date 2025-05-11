import { getCards } from "@api/cards";
import { Card } from "@entity";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormAddCard from "./AddCardForm";

interface Props {
    onSelect: (card: Card) => void;
    onCancelAddCard: () => void;
    credit: boolean;
}

export default function CardList({ onSelect, onCancelAddCard, credit }: Props) {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<number>(-1);
    const [openCardForm, setOpenCardForm] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSetCard = (index: number) => {
        setSelectedCard(index);
        const card = cards[index];
        onSelect(card);
        console.log(card);
    }

    const loadCards = async () => {
        try {
            setIsLoading(true);
            const cards = await getCards();
            setIsLoading(false);
            setCards(cards.filter(card => card.payment_method_id === (credit ? 3 : 4)));
        } catch (error) {
            console.error("Error loading cards:", error);
        }
        setIsLoading(false);
    }

    const handleAddCard = (card: Card) => {
        setCards([...cards, card]);
        setOpenCardForm(false);
    }

    useEffect(() => {
        loadCards();
    }, []);

    useEffect(() => {
        setCards(cards.filter(card => card.payment_method_id === (credit ? 3 : 4)));
    }, [credit])
    return (
        <View style={{ width: '100%', alignItems: "center" }}>
            {isLoading ? (
                <View style={{ flex: 1, height: 180, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) :
                (openCardForm || cards.length == 0) ?
                    <FormAddCard onAddCard={handleAddCard} onCancel={() => onCancelAddCard()} credit={credit} />
                    :
                    <View style={styles.cardsContainer}>
                        <FlatList
                            data={cards}
                            keyExtractor={(item) => item.guid || ""}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={item.guid}
                                    style={[styles.button, styles.cardButton, selectedCard === index ? styles.cardSelected : styles.card, { backgroundColor: '#' + item.identification_color }]}
                                    onPress={() => onSetCard(index)}
                                >
                                    <Text style={styles.buttonText}>
                                        {typeof item.name === "string" && item.name.trim() !== ""
                                            ? item.name
                                            : `Cartão ${index + 1}`}
                                    </Text>
                                    <View style={styles.methodTag}>
                                        <Text style={styles.methodText}> {item.payment_method_id === 3 ? "Crédito" : "Débito"}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, gap: 10, alignItems: 'center' }}
                        />
                        {selectedCard === -1 &&
                            <TouchableOpacity style={styles.addButton} onPress={() => setOpenCardForm(true)} >
                                <Text style={styles.methodText}>Adicionar cartão</Text>
                            </TouchableOpacity>
                        }
                    </View>
            }
        </View>
    );

}

const styles = StyleSheet.create({
    button: {
        width: '50%',
        padding: 10,
        position: 'relative'
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
    },
    cardButton: {
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    card: {
        width: 190,
        height: 120,
        borderRadius: 8
    },
    cardSelected: {
        width: 210,
        height: 140,
    },
    cardsContainer: {
        padding: 20,
        height: 220
    },
    methodTag: {
        position: 'absolute',
        right: 8,
        bottom: 4,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 6,
        padding: 2
    },
    methodText: {
        color: '#fff'
    },
    addButton: {
        backgroundColor: '#000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    }
})