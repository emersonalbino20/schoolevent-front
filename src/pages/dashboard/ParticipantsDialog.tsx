import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ParticipantsDialog = ({ isOpen, onClose, evento }) => {
  // Get initials for avatar fallback
  const getInitials = (name, surname) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={18} />
            Participantes Inscritos
            <Badge variant="secondary" className="ml-2">
              {evento?.inscricoes?.length || 0} inscritos
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Evento: {evento?.titulo}
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </DialogClose>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {evento?.inscricoes?.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              Nenhum participante inscrito neste evento.
            </div>
          ) : (
            <div className="space-y-4">
              {evento?.inscricoes?.map((inscricao) => (
                <div 
                  key={inscricao.usuario.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md"
                >
                  <Avatar>
                    <AvatarImage 
                      src={`http://localhost:3333${inscricao.usuario.foto_perfil}`} 
                      alt={`${inscricao.usuario.nome} ${inscricao.usuario.sobrenome}`} 
                    />
                    <AvatarFallback>
                      {getInitials(inscricao.usuario.nome, inscricao.usuario.sobrenome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{inscricao.usuario.nome} {inscricao.usuario.sobrenome}</p>
                    <p className="text-sm text-muted-foreground">{inscricao.usuario.email}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {inscricao.usuario.tipo}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsDialog;
