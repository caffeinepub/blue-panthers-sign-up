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

export const POSITION_MAX_CAPACITY = 3;
export const TOTAL_TEAM_SLOTS = 3;

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
            queryClient.invalidateQueries({ queryKey: ['allSignUps'] });
            queryClient.invalidateQueries({ queryKey: ['remainingSlots'] });
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

export function useGetRemainingSlots() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<number>({
        queryKey: ['remainingSlots'],
        queryFn: async () => {
            if (!actor) return TOTAL_TEAM_SLOTS;
            try {
                const signUps = await actor.getAllSignUps();
                const remaining = Math.max(0, TOTAL_TEAM_SLOTS - signUps.length);
                return remaining;
            } catch {
                // If unauthorized (anonymous user), we can't fetch count
                // Return null to indicate unknown
                return -1;
            }
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });
}

export function useIsCallerAdmin() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<boolean>({
        queryKey: ['isCallerAdmin'],
        queryFn: async () => {
            if (!actor) return false;
            return actor.isCallerAdmin();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });
}
