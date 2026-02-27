import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Position, ExperienceLevel, type SignUp } from '../backend';

export interface SignUpFormData {
    name: string;
    email: string;
    phone: string;
    age: string;
    position: Position;
    experienceLevel: ExperienceLevel;
}

export function useSubmitSignUp() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SignUpFormData) => {
            if (!actor) throw new Error('Backend not available. Please try again.');

            const age = parseInt(data.age, 10);
            if (isNaN(age) || age < 1) throw new Error('Invalid age provided.');

            const result = await actor.submitSignUp(
                data.name,
                data.email,
                data.phone,
                BigInt(age),
                data.position,
                data.experienceLevel
            );
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['signUps'] });
        },
    });
}

export function useGetAllSignUps() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<SignUp[]>({
        queryKey: ['allSignUps'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllSignUps();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });
}
