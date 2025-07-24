// /app/api/modalites/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVICE_ROLE pour écrire
);

export async function GET() {
  const { data, error } = await supabase
    .from('modalites_inscription')
    .select('*')
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { texte } = await request.json();

  if (!texte) return NextResponse.json({ error: 'Texte requis' }, { status: 400 });

  const { data, error } = await supabase
    .from('modalites_inscription')
    .insert([{ texte }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, texte } = await request.json();

  if (!id || !texte)
    return NextResponse.json({ error: 'id et texte requis' }, { status: 400 });

  const { data, error } = await supabase
    .from('modalites_inscription')
    .update({ texte })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { error } = await supabase
    .from('modalites_inscription')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
